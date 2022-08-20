/* eslint-disable prefer-const */ // to satisfy AS compiler

// For each division by 10, add one to exponent to truncate one significant figure

import { isNullOrUndefined } from '@typegoose/typegoose/lib/internal/utils';
import Decimal from 'decimal.js';
import Container from 'typedi';
import { Config } from '../../../config';
import { web3 } from '../../../loaders/web3';
import { AccountDb, AccountModel } from '../../../models/lending/account';
import { AccountCTokenDb, AccountCTokenModel } from '../../../models/lending/accountCToken';
import { ComptrollerDb } from '../../../models/lending/comptroller';
import { Market, MarketDb, MarketModel } from '../../../models/lending/market';
import { BaseV1RouterABI } from '../../../utils/abiParser/baseV1Router';
import { cTokenABI } from '../../../utils/abiParser/ctoken';
import { ADDRESS_ZERO, ZERO_BD } from '../../../utils/constants';
import { fetchTokenDecimals, fetchTokenName, fetchTokenSymbol } from '../../../utils/dex/token';
import { convertToDecimal, exponentToBigDecimal } from '../../../utils/helper';
import { AccountService } from './account';
import { AccountCTokenService } from './accountCToken';
import { ComptrollerService } from './comptroller';
import { MarketService } from './market';


export async function createAccountCToken(
  cTokenStatsID: string,
  symbol: string,
  account: string,
  marketID: string,
): Promise<AccountCTokenDb> {
  let cTokenStats = new AccountCTokenDb(cTokenStatsID);
  cTokenStats.symbol = symbol
  cTokenStats.market = marketID
  cTokenStats.account = account
  cTokenStats.accrualBlockNumber = ZERO_BD
  cTokenStats.cTokenBalance = ZERO_BD
  cTokenStats.totalUnderlyingSupplied = ZERO_BD
  cTokenStats.totalUnderlyingRedeemed = ZERO_BD
  cTokenStats.accountBorrowIndex = ZERO_BD
  cTokenStats.totalUnderlyingBorrowed = ZERO_BD
  cTokenStats.totalUnderlyingRepaid = ZERO_BD
  cTokenStats.storedBorrowBalance = ZERO_BD
  cTokenStats.enteredMarket = false

  return await new AccountCTokenModel(cTokenStats).save();
}

export async function createAccount(accountID: string): Promise<AccountDb> {
  let accountDb = new AccountDb(accountID)
  accountDb.countLiquidated = ZERO_BD
  accountDb.countLiquidator = ZERO_BD
  accountDb.hasBorrowed = false

  return await new AccountModel(accountDb).save();
}

export async function updateCommonCTokenStats(
  marketID: string,
  marketSymbol: string,
  accountID: string,
  txHash: string,
  timestamp: number,
  blockNumber: number,
): Promise<AccountCTokenDb> {
  let cTokenStatsID = marketID.concat('-').concat(accountID)
  const actService = Container.get(AccountCTokenService);
  let cTokenStats: AccountCTokenDb = await actService.getById(cTokenStatsID) as AccountCTokenDb;
  if (cTokenStats == null) {
    cTokenStats = await createAccountCToken(cTokenStatsID, marketSymbol, accountID, marketID)
  }
  let txHashes = cTokenStats.transactionHashes as string[];
  if (isNullOrUndefined(txHashes)) {
    txHashes = [];
  }
  txHashes.push(txHash)
  cTokenStats.transactionHashes = txHashes
  let txTimes = cTokenStats.transactionTimes as Decimal[];
  if (isNullOrUndefined(txTimes)) {
    txTimes = [];
  }
  txTimes.push(convertToDecimal(timestamp))
  cTokenStats.transactionTimes = txTimes
  cTokenStats.accrualBlockNumber = convertToDecimal(blockNumber)

  return cTokenStats as AccountCTokenDb
}

export async function createMarket(marketAddress: string): Promise<MarketDb> {
  let cUSDCAddress = Config.canto.lendingDashboard.cUSDC_ADDRESS;
  let cETHAddress = Config.canto.lendingDashboard.cETH_ADDRESS;

  let market: MarketDb;
  let contract = new web3.eth.Contract(cTokenABI, marketAddress);
  // It is CETH, which has a slightly different interface
  if (marketAddress == cETHAddress) {
    market = new MarketDb(marketAddress);
    market.underlyingAddress = ADDRESS_ZERO;

    market.underlyingDecimals = new Decimal('18');
    market.underlyingPrice = new Decimal('1');
    market.underlyingName = 'Ether';
    market.underlyingSymbol = 'ETH';

    // It is all other CERC20 contracts
  } else {
    market = new MarketDb(marketAddress);
    let underLyingAddress = "";
    try {
      underLyingAddress = await contract.methods.underlying().call() as string;
    } catch (e) {
      console.error("createMarket", marketAddress, e);
    }
    market.underlyingAddress = underLyingAddress as string;
    market.underlyingDecimals = new Decimal(await fetchTokenDecimals(market.underlyingAddress));
    market.underlyingName = await fetchTokenName(market.underlyingAddress);
    market.underlyingSymbol = await fetchTokenSymbol(market.underlyingAddress);

    if (marketAddress == cUSDCAddress) {
      market.underlyingPriceUSD = new Decimal('1')
    }
  }

  market.borrowRate = ZERO_BD;
  market.totalCash = ZERO_BD;
  market.collateralFactor = ZERO_BD;
  market.exchangeRate = ZERO_BD;
  market.interestRateModelAddress = ADDRESS_ZERO;
  market.name = await fetchTokenName(marketAddress);
  market.numberOfBorrowers = ZERO_BD;
  market.numberOfSuppliers = ZERO_BD;
  market.totalReserves = ZERO_BD;
  market.supplyRate = ZERO_BD;
  market.symbol = await fetchTokenSymbol(marketAddress);
  market.totalBorrows = ZERO_BD;
  market.totalSupply = ZERO_BD;
  market.underlyingPrice = ZERO_BD;

  market.accrualBlockNumber = ZERO_BD;
  market.blockTimestamp = ZERO_BD;
  market.borrowIndex = ZERO_BD;
  market.reserveFactor = ZERO_BD;
  market.underlyingPriceUSD = ZERO_BD;

  return await new MarketModel(market).save();
}

export async function updateMarket(
  marketAddress: string,
  blockNumber: number,
  blockTimestamp: number,
): Promise<MarketDb> {
  let cUSDCAddress = Config.canto.lendingDashboard.cUSDC_ADDRESS;
  let cETHAddress = Config.canto.lendingDashboard.cETH_ADDRESS;

  let mantissaFactor = Config.canto.lendingDashboard.MANTISSA_FACTOR;
  let cTokenDecimals = Config.canto.lendingDashboard.cTOKEN_DECIMALS;
  let mantissaFactorBD: Decimal = exponentToBigDecimal(18)
  let cTokenDecimalsBD: Decimal = exponentToBigDecimal(8)

  const marketService = Container.get(MarketService);
  const accountService = Container.get(AccountService);

  let market: MarketDb = await marketService.getByAddress(marketAddress) as MarketDb;
  if (market === null) {
    market = await createMarket(marketAddress);
  }

  // market = market as MarketDb;
  // Only updateMarket if it has not been updated this block
  if (!convertToDecimal(market.accrualBlockNumber).equals(convertToDecimal(blockNumber))) {
    let contractAddress = market.id;
    let contract = await new web3.eth.Contract(cTokenABI, contractAddress);
    let usdPrice = await getUSDCPrice(blockNumber);
    let underlyingDecimals = convertToDecimal(market.underlyingDecimals).toNumber();

    // if cETH, only update USD price
    if (market.id == cETHAddress) {
      market.underlyingPriceUSD = convertToDecimal(market.underlyingPrice)
        .div(usdPrice)
        .toDecimalPlaces(convertToDecimal(underlyingDecimals).toNumber());
    } else {
      let tokenPriceEth = await getTokenPrice(
        blockNumber,
        contractAddress,
        market.underlyingAddress,
        underlyingDecimals
      )

      market.underlyingPrice = convertToDecimal(tokenPriceEth)
        .toDecimalPlaces(convertToDecimal(underlyingDecimals).toNumber());

      // if USDC, only update ETH price
      if (market.id != cUSDCAddress) {
        market.underlyingPriceUSD = convertToDecimal(market.underlyingPrice)
          .div(usdPrice)
          .toDecimalPlaces(convertToDecimal(underlyingDecimals).toNumber());
      }
    }

    let accrualBlockNumber = await contract.methods.accrualBlockNumber().call();
    market.accrualBlockNumber = convertToDecimal(accrualBlockNumber);
    market.blockTimestamp = convertToDecimal(blockTimestamp);
    let totalSupply = await contract.methods.totalSupply().call();
    market.totalSupply = convertToDecimal(totalSupply).div(cTokenDecimalsBD);

    /* Exchange rate explanation
       In Practice
        - If you call the cDAI contract on etherscan it comes back (2.0 * 10^26)
        - If you call the cUSDC contract on etherscan it comes back (2.0 * 10^14)
        - The real value is ~0.02. So cDAI is off by 10^28, and cUSDC 10^16
       How to calculate for tokens with different decimals
        - Must div by tokenDecimals, 10^market.underlyingDecimals
        - Must multiply by ctokenDecimals, 10^8
        - Must div by mantissa, 10^18
     */
    let exchangeRateStored = await contract.methods.exchangeRateStored().call();
    market.exchangeRate = convertToDecimal(exchangeRateStored)
      .div(exponentToBigDecimal(underlyingDecimals))
      .times(cTokenDecimalsBD)
      .div(mantissaFactorBD)
      .toDecimalPlaces(mantissaFactor)

    let borrowIndex = await contract.methods.borrowIndex().call();
    market.borrowIndex = convertToDecimal(borrowIndex)
      .div(mantissaFactorBD)
      .toDecimalPlaces(mantissaFactor);

    let reserves = await contract.methods.totalReserves().call(); // todo: correct method?
    market.reserves = convertToDecimal(reserves)
      .div(exponentToBigDecimal(underlyingDecimals))
      .toDecimalPlaces(underlyingDecimals)

    let totalBorrows = await contract.methods.totalBorrows().call();
    market.totalBorrows = convertToDecimal(totalBorrows)
      .div(exponentToBigDecimal(underlyingDecimals))
      .toDecimalPlaces(underlyingDecimals);

    let cash = await contract.methods.getCash().call();
    market.cash = convertToDecimal(cash)
      .div(exponentToBigDecimal(underlyingDecimals))
      .toDecimalPlaces(underlyingDecimals);

    // must convert to Decimal and remove 10^18 used in Exp in Compound Solidity
    let borrowRatePerBlock = await contract.methods.borrowRatePerBlock().call();
    market.supplyRate = convertToDecimal(borrowRatePerBlock)
      .times(new Decimal("21202400"))
      .div(mantissaFactorBD)
      .toDecimalPlaces(mantissaFactor);

    // (in commpund code they have some fall back, we have removed it)
    try {
      let supplyRatePerBlock = await contract.methods.supplyRatePerBlock().call();
      market.borrowRate = convertToDecimal(supplyRatePerBlock)
        .times(new Decimal("2102400"))
        .div(mantissaFactorBD)
        .toDecimalPlaces(mantissaFactor);
    } catch (e) {
      market.borrowRate = ZERO_BD;
      console.log("cToken ", blockNumber, market.id, " supplyRatePerBlock() failed")
    }

    await marketService.save(market);
  }

  return market;
}

async function getTokenPrice(
  blockNumber: number,
  eventAddress: string,
  underlyingAddress: string,
  underlyingDecimals: number) {

  // services
  let comptrollerService = Container.get(ComptrollerService);

  // 
  let comptroller: ComptrollerDb = await comptrollerService.getById('1') as ComptrollerDb;
  let oracleAddress = Config.contracts.baseV1Router.addresses[0];
  if (comptroller !== null) {
    oracleAddress = comptroller.priceOracle;
  }

  let mantissaDecimalFactor = 18 - underlyingDecimals + 18
  let bdFactor = exponentToBigDecimal(mantissaDecimalFactor)
  let contract = await new web3.eth.Contract(BaseV1RouterABI, oracleAddress);
  let price = await contract.methods.getUnderlyingPrice(eventAddress).call();
  let underlyingPrice = convertToDecimal(price).div(bdFactor);
  return underlyingPrice

  // return ONE_BD;

}

async function getUSDCPrice(blockNumber: number) {
  // services
  let comptrollerService = Container.get(ComptrollerService);

  // 
  let comptroller: ComptrollerDb = await comptrollerService.getById('1') as ComptrollerDb;
  let oracleAddress = Config.contracts.baseV1Router.addresses[0];
  if (comptroller !== null) {
    oracleAddress = comptroller.priceOracle;
  }
  let priceOracle1Address = "" // todo: move to config
  let cUSDC_ADDRESS = Config.canto.lendingDashboard.cUSDC_ADDRESS;


  let contract = await new web3.eth.Contract(BaseV1RouterABI, oracleAddress);
  let underlyingDecimals = 6;
  let mantissaDecimalFactor = 18 - underlyingDecimals + 18
  let bdFactor = exponentToBigDecimal(mantissaDecimalFactor)
  let price = await contract.methods.getUnderlyingPrice(cUSDC_ADDRESS).call();
  let underlyingPrice = convertToDecimal(price).div(bdFactor);
  return underlyingPrice

  // return ONE_BD;
}