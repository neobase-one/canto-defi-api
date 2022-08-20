import Decimal from "decimal.js";
import Container from "typedi";
import { EventData } from "web3-eth-contract";
import { AccountDb, AccountModel } from "../../../models/lending/account";
import { AccountCTokenModel } from "../../../models/lending/accountCToken";
import { Market, MarketDb, MarketModel } from "../../../models/lending/market";
import { AccrueInterestInput, BorrowInput, LiquidateBorrowInput, NewMarketInterestRateModelInput, NewReserveFactorInput, RepayBorrowInput, TransferInput } from "../../../types/event/lending/ctoken";
import { ONE_BD, ZERO_BD } from "../../../utils/constants";
import { convertToDecimal, getTimestamp } from "../../../utils/helper";
import { AccountService } from "../models/account";
import { AccountCTokenService } from "../models/accountCToken";
import { createAccount, createMarket, updateCommonCTokenStats, updateMarket } from "../models/helper";
import { MarketService } from "../models/market";

// todo: remove unused services

export async function handleBorrowEvent(
  event: EventData,
  input: BorrowInput
) {
  const marketService = Container.get(MarketService);
  const accountService = Container.get(AccountService);
  let actService = Container.get(AccountCTokenService);

  let market: MarketDb = await marketService.getByAddress(event.address) as MarketDb;
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
    let previousBorrow = convertToDecimal(cTokenStats.storedBorrowBalance);
    cTokenStats.storedBorrowBalance = input.accountBorrows;
    cTokenStats.accountBorrowIndex = market.borrowIndex;
    cTokenStats.totalUnderlyingBorrowed = convertToDecimal(cTokenStats.totalUnderlyingBorrowed).plus(
      input.borrowAmount
    );

    await actService.save(cTokenStats);

    let accountDb: AccountDb = await accountService.getById(accountID) as AccountDb;
    if (accountDb == null) {
      accountDb = await createAccount(accountID);
    }
    accountDb.hasBorrowed = true;
    await accountService.save(accountDb);

    if (
      previousBorrow.equals(ZERO_BD) &&
      !input.accountBorrows.equals(ZERO_BD) // checking edge case for borrwing 0
    ) {
      market.numberOfBorrowers = convertToDecimal(market.numberOfBorrowers).add(1);

      await marketService.save(market);
    }
  }
}

export async function handleRepayBorrowEvent(
  event: EventData,
  input: RepayBorrowInput
) {
  const marketService = Container.get(MarketService);
  const accountService = Container.get(AccountService);
  let actService = Container.get(AccountCTokenService);

  let market: MarketDb = await marketService.getByAddress(event.address) as MarketDb;
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
    await actService.save(cTokenStats)

    let account: AccountDb = await accountService.getById(accountID) as AccountDb;
    if (account == null) {
      account = await createAccount(accountID);
    }

    if (convertToDecimal(cTokenStats.storedBorrowBalance).equals(ZERO_BD)) {
      market.numberOfBorrowers = convertToDecimal(market.numberOfBorrowers).minus(1);

      await marketService.save(market);
    }
  }
}

export async function handleLiquidateBorrowEvent(
  event: EventData,
  input: LiquidateBorrowInput
) {
  const accountService = Container.get(AccountService);

  let liquidatorID = input.liquidator;
  let liquidatorDb: AccountDb = await accountService.getById(liquidatorID) as AccountDb;
  if (liquidatorDb == null) {
    liquidatorDb = await createAccount(liquidatorID);
  }
  liquidatorDb.countLiquidator = convertToDecimal(liquidatorDb.countLiquidator)
    .plus(ONE_BD);

    await accountService.save(liquidatorDb);

  let borrowerID = input.borrower;
  let borrowerDb: AccountDb = await accountService.getById(borrowerID) as AccountDb;
  if (borrowerDb == null) {
    borrowerDb = await createAccount(borrowerID);
  }
  borrowerDb.countLiquidated = convertToDecimal(borrowerDb.countLiquidated)
    .plus(ONE_BD);

  await accountService.save(borrowerDb);
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

  let market: MarketDb = await marketService.getByAddress(event.address) as MarketDb;
  if (market !== null) {
    market.reserveFactor = input.newReserveFactorMantissa;

    await marketService.save(market);
  }
}

export async function handleTransferEvent(
  event: EventData,
  input: TransferInput
) {
  const marketService = Container.get(MarketService);
  const accountService = Container.get(AccountService);
  let actService = Container.get(AccountCTokenService);

  let timestamp = await getTimestamp(event.blockNumber);

  let marketID = event.address;
  let marketDb: MarketDb = await marketService.getByAddress(marketID) as MarketDb;

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
  let exchangeRate = convertToDecimal(marketDb.exchangeRate);
  let amountUnderlying = exchangeRate.times(input.amount);
  let marketUnderlyingDecimals = convertToDecimal(marketDb.underlyingDecimals).toNumber();
  let amountUnderylingTruncated = amountUnderlying.toDecimalPlaces(marketUnderlyingDecimals);

  let accountFromID = input.from;

  // Checking if the tx is FROM the cToken contract (i.e. this will not run when minting)
  // If so, it is a mint, and we don't need to run these calculations
  if (accountFromID != marketID) {
    let accountFrom: AccountDb = await accountService.getById(accountFromID) as AccountDb;
    if (accountFrom == null) {
      await createAccount(accountFromID)
    }

    // Update cTokenStats common for all events, and return the stats to update unique
    // values for each event
    let cTokenStatsFrom = await updateCommonCTokenStats(
      marketDb.id,
      marketDb.symbol,
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

    await actService.save(cTokenStatsFrom);

    if (convertToDecimal(cTokenStatsFrom.cTokenBalance).equals(ZERO_BD)) {
      marketDb.numberOfSuppliers = convertToDecimal(marketDb.numberOfSuppliers).minus(1);

      await marketService.save(marketDb);
    }
  }

  let accountToID = input.to;
  // Checking if the tx is TO the cToken contract (i.e. this will not run when redeeming)
  // If so, we ignore it. this leaves an edge case, where someone who accidentally sends
  // cTokens to a cToken contract, where it will not get recorded. Right now it would
  // be messy to include, so we are leaving it out for now TODO fix this in future
  if (accountToID != marketID) {
    let accountTo: AccountDb = await accountService.getById(accountToID) as AccountDb;
    if (accountTo == null) {
      await createAccount(accountToID);
    }

    // Update cTokenStats common for all events, and return the stats to update unique
    // values for each event
    let cTokenStatsTo = await updateCommonCTokenStats(
      marketDb.id,
      marketDb.symbol,
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
    await actService.save(cTokenStatsTo);

    if (
      previousCTokenBalanceTo.equals(ZERO_BD) &&
      !input.amount.equals(ZERO_BD) // checking edge case for transfers of 0
    ) {
      marketDb.numberOfSuppliers = convertToDecimal(marketDb.numberOfSuppliers).plus(1);

      await marketService.save(marketDb);
    }
  }
}

export async function handleNewMarketInterestRateModelEvent(
  event: EventData,
  input: NewMarketInterestRateModelInput
) {
  const marketService = Container.get(MarketService);

  let marketID = event.address;
  let market: MarketDb = await marketService.getByAddress(marketID) as MarketDb;
  if (market == null) {
    market = await createMarket(marketID);
  }
  market.interestRateModelAddress = input.newInterestRateModel;
  
  await marketService.save(market);
}