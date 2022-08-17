import Decimal from "decimal.js";
import Container from "typedi";
import { EventData } from "web3-eth-contract";
import { AccountDb, AccountModel } from "../../../models/lending/account";
import { AccountCTokenModel } from "../../../models/lending/accountCToken";
import { MarketDb, MarketModel } from "../../../models/lending/market";
import { AccrueInterestInput, BorrowInput, LiquidateBorrowInput, NewMarketInterestRateModelInput, NewReserveFactorInput, RepayBorrowInput, TransferInput } from "../../../types/event/lending/ctoken";
import { ZERO_BD } from "../../../utils/constants";
import { convertToDecimal, getTimestamp } from "../../../utils/helper";
import { AccountService } from "../models/account";
import { createAccount, createMarket, updateCommonCTokenStats, updateMarket } from "../models/helper";
import { MarketService } from "../models/market";

// todo: remove unused services

export async function handleBorrowEvent(
  event: EventData,
  input: BorrowInput
) {
  const marketService = Container.get(MarketService);
  const accountService = Container.get(AccountService);

  let market = await marketService.getByAddress(event.address);
  let accountID = input.borrower;

  // Update cTokenStats common for all events, and return the stats to update unique
  // values for each event
  if (market !== null) {
    let timestamp = await getTimestamp(event.blockNumber);
    let cTokenStats = await updateCommonCTokenStats(
      market.id,
      market.symbol,
      accountID,
      event.transactionHash,
      timestamp,
      event.blockNumber,
    )
    let previousBorrow = cTokenStats.storedBorrowBalance;
    cTokenStats.storedBorrowBalance = input.accountBorrows;
    cTokenStats.accountBorrowIndex = market.borrowIndex;
    cTokenStats.totalUnderlyingBorrowed = convertToDecimal(cTokenStats.totalUnderlyingBorrowed).plus(
      input.borrowAmount
    );
    const cToken = new AccountCTokenModel(cTokenStats);
    await cToken.save();

    let accountDb: any = await accountService.getById(accountID);
    if (accountDb == null) {
      accountDb = await createAccount(accountID);
    }
    accountDb.hasBorrowed = true;
    const account = new AccountModel(accountDb as AccountDb);
    await account.save();

    if (
      previousBorrow.equals(ZERO_BD) &&
      !input.accountBorrows.equals(ZERO_BD) // checking edge case for borrwing 0
    ) {
      market.numberOfBorrowers = convertToDecimal(market.numberOfBorrowers).add(1);
      await market.save();
    }
  }
}

export async function handleRepayBorrowEvent(
  event: EventData,
  input: RepayBorrowInput
) {
  const marketService = Container.get(MarketService);
  const accountService = Container.get(AccountService);

  let market = await marketService.getByAddress(event.address);
  let accountID = input.borrower;

  // Update cTokenStats common for all events, and return the stats to update unique
  // values for each event
  if (market !== null) {
    let timestamp = await getTimestamp(event.blockNumber);
    let cTokenStats = await updateCommonCTokenStats(
      market.id,
      market.symbol,
      accountID,
      event.transactionHash,
      timestamp,
      event.blockNumber,
    )

    let repayAmountBD = input.repayAmount;

    cTokenStats.storedBorrowBalance = input.accountBorrows;

    cTokenStats.accountBorrowIndex = market.borrowIndex
    cTokenStats.totalUnderlyingRepaid = convertToDecimal(cTokenStats.totalUnderlyingRepaid).plus(
      repayAmountBD
    )
    const cToken = new AccountCTokenModel(cTokenStats);
    await cToken.save();

    let account: any = await accountService.getById(accountID);
    if (account == null) {
      account = await createAccount(accountID);
    }

    if (cTokenStats.storedBorrowBalance.equals(ZERO_BD)) {
      market.numberOfBorrowers = convertToDecimal(market.numberOfBorrowers).minus(1);
      await market.save();
    }
  }
}

export async function handleLiquidateBorrowEvent(
  event: EventData,
  input: LiquidateBorrowInput
) {
  const accountService = Container.get(AccountService);

  let liquidatorID = input.liquidator;
  let liquidatorDb: any = await accountService.getById(liquidatorID);
  if (liquidatorDb == null) {
    liquidatorDb = await createAccount(liquidatorID);
  }
  liquidatorDb.countLiquidator = liquidatorDb.countLiquidator + 1;
  const liquidator = new AccountModel(liquidatorDb as AccountDb);
  await liquidator.save();

  let borrowerID = input.borrower;
  let borrowerDb: any = await accountService.getById(borrowerID);
  if (borrowerDb == null) {
    borrowerDb = await createAccount(borrowerID);
  }
  borrowerDb.countLiquidated = borrowerDb.countLiquidated + 1;
  const borrower = new AccountModel(borrowerDb as AccountDb);
  await borrower.save();
}

export async function handleAccrueInterestEvent(
  event: EventData,
  input: AccrueInterestInput
) {
  let timestamp = await getTimestamp(event.blockNumber);
  await updateMarket(event.address, event.blockNumber, timestamp);
}

export async function handleNewReserveFactorEvent(
  event: EventData,
  input: NewReserveFactorInput
) {
  const marketService = Container.get(MarketService);

  let market = await marketService.getByAddress(event.address);
  if (market !== null) {
    market.reserveFactor = input.newReserveFactorMantissa;
    await market.save()
  }
}

export async function handleTransferEvent(
  event: EventData,
  input: TransferInput
) {
  const marketService = Container.get(MarketService);
  const accountService = Container.get(AccountService);
  let timestamp = await getTimestamp(event.blockNumber);

  let marketID = event.address;
  let marketDb: any = await marketService.getByAddress(marketID);

  if (marketDb !== null) {
    let accrualBlockNumber = marketDb.accrualBlockNumber as Decimal;
    if (accrualBlockNumber !== new Decimal(event.blockNumber)) {
      let timestamp = await getTimestamp(event.blockNumber);
      marketDb = await updateMarket(
        event.address,
        event.blockNumber,
        timestamp,
      )
    }
  }
  let market = marketDb as MarketDb;
  let exchangeRate = convertToDecimal(market.exchangeRate);
  let amountUnderlying = exchangeRate.times(input.amount);
  let marketUnderlyingDecimals = convertToDecimal(market.underlyingDecimals).toNumber();
  let amountUnderylingTruncated = amountUnderlying.toDecimalPlaces(marketUnderlyingDecimals);

  let accountFromID = input.from;

  // Checking if the tx is FROM the cToken contract (i.e. this will not run when minting)
  // If so, it is a mint, and we don't need to run these calculations
  if (accountFromID != marketID) {
    let accountFrom = await accountService.getById(accountFromID);
    if (accountFrom == null) {
      await createAccount(accountFromID)
    }

    // Update cTokenStats common for all events, and return the stats to update unique
    // values for each event
    let cTokenStatsFrom = await updateCommonCTokenStats(
      market.id,
      market.symbol,
      accountFromID,
      event.transactionHash,
      timestamp,
      event.blockNumber,
    )

    cTokenStatsFrom.cTokenBalance = convertToDecimal(cTokenStatsFrom.cTokenBalance).minus(
      input.amount
    )

    cTokenStatsFrom.totalUnderlyingRedeemed = convertToDecimal(cTokenStatsFrom.totalUnderlyingRedeemed).plus(
      amountUnderylingTruncated,
    )
    const cTokenStats = new AccountCTokenModel(cTokenStatsFrom);
    await cTokenStats.save();

    if (cTokenStatsFrom.cTokenBalance.equals(ZERO_BD)) {
      market.numberOfSuppliers = convertToDecimal(market.numberOfSuppliers).minus(1);
      await new MarketModel(market).save();
    }
  }

  let accountToID = input.to;
  // Checking if the tx is TO the cToken contract (i.e. this will not run when redeeming)
  // If so, we ignore it. this leaves an edge case, where someone who accidentally sends
  // cTokens to a cToken contract, where it will not get recorded. Right now it would
  // be messy to include, so we are leaving it out for now TODO fix this in future
  if (accountToID != marketID) {
    let accountTo = await accountService.getById(accountToID);
    if (accountTo == null) {
      await createAccount(accountToID);
    }

    // Update cTokenStats common for all events, and return the stats to update unique
    // values for each event
    let cTokenStatsTo = await updateCommonCTokenStats(
      market.id,
      market.symbol,
      accountToID,
      event.transactionHash,
      timestamp,
      event.blockNumber,
    );

    let previousCTokenBalanceTo = convertToDecimal(cTokenStatsTo.cTokenBalance)
    cTokenStatsTo.cTokenBalance = convertToDecimal(cTokenStatsTo.cTokenBalance).plus(
      input.amount
    )

    cTokenStatsTo.totalUnderlyingSupplied = convertToDecimal(cTokenStatsTo.totalUnderlyingSupplied).plus(
      amountUnderylingTruncated,
    )
    await new AccountCTokenModel(cTokenStatsTo).save();

    if (
      previousCTokenBalanceTo.equals(ZERO_BD) &&
      !input.amount.equals(ZERO_BD) // checking edge case for transfers of 0
    ) {
      market.numberOfSuppliers = convertToDecimal(market.numberOfSuppliers).plus(1);
      await new MarketModel(market).save();
    }
  }
}

export async function handleNewMarketInterestRateModelEvent(
  event: EventData,
  input: NewMarketInterestRateModelInput
) {
  const marketService = Container.get(MarketService);

  let marketID = event.address;
  let market: any = await marketService.getByAddress(marketID);
  if (market == null) {
    market = await createMarket(marketID);
  }
  market.interestRateModelAddress = input.newInterestRateModel;
  await new MarketModel(market as MarketDb).save();
}