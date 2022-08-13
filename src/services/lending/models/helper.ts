/* eslint-disable prefer-const */ // to satisfy AS compiler

// For each division by 10, add one to exponent to truncate one significant figure

import Container from 'typedi';
import { web3 } from '../../../loaders/web3';
import { AccountDb, AccountModel } from '../../../models/lending/account';
import { AccountCTokenDb } from '../../../models/lending/accountCToken';
import { Market, MarketDb } from '../../../models/lending/market';
import { cTokenABI } from '../../../utils/abiParser/ctoken';
import { ADDRESS_ZERO, ONE_BD, ZERO_BD } from '../../../utils/constants';
import { bigDecimalExp18, convertToDecimal, exponentToBigDecimal } from '../../../utils/helper';
import { AccountService } from './account';
import { MarketService } from './market';
import Decimal from 'decimal.js';
import { Erc20ABI } from '../../../utils/abiParser/erc20';
import { fetchTokenDecimals, fetchTokenSymbol, fetchTokenName } from '../../../utils/dex/token';
import { ComptrollerService } from './comptroller';
import { Config } from '../../../config';


export function createAccountCToken(
  cTokenStatsID: string,
  symbol: string,
  account: string,
  marketID: string,
): AccountCTokenDb {
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
  return cTokenStats
}

export async function createAccount(accountID: string): Promise<AccountDb> {
  let accountDb = new AccountDb(accountID)
  accountDb.countLiquidated = ZERO_BD
  accountDb.countLiquidator = ZERO_BD
  accountDb.hasBorrowed = false
  const account = new AccountModel(accountDb);
  await account.save();
  return account
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
  const accountService = Container.get(AccountService);
  let cTokenStats: any = await accountService.getById(cTokenStatsID);
  if (cTokenStats == null) {
    cTokenStats = createAccountCToken(cTokenStatsID, marketSymbol, accountID, marketID)
  }
  let txHashes = cTokenStats.transactionHashes
  txHashes.push(txHash)
  cTokenStats.transactionHashes = txHashes
  let txTimes = cTokenStats.transactionTimes
  txTimes.push(timestamp)
  cTokenStats.transactionTimes = txTimes
  cTokenStats.accrualBlockNumber = blockNumber
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
    let underLyingAddress = await contract.methods.underlying().call();
    market.underlyingAddress = String(underLyingAddress);
    market.underlyingDecimals = new Decimal(fetchTokenDecimals(market.underlyingAddress));
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

  return market
}


export async function updateMarket(
  marketAddress: string,
  blockNumber: number,
  blockTimestamp: number,
): Promise<Market> {
  let cUSDCAddress = Config.canto.lendingDashboard.cUSDC_ADDRESS;
  let cETHAddress = Config.canto.lendingDashboard.cETH_ADDRESS;

  let mantissaFactor = Config.canto.lendingDashboard.MANTISSA_FACTOR;
  let cTokenDecimals = Config.canto.lendingDashboard.cTOKEN_DECIMALS;
  let mantissaFactorBD: Decimal = exponentToBigDecimal(18)
  let cTokenDecimalsBD: Decimal = exponentToBigDecimal(8)

  console.log("enter")
  const marketService = Container.get(MarketService);
  const accountService = Container.get(AccountService);

  let market: any = await marketService.getByAddress(marketAddress);
  if (market == null) {
    market = await createMarket(marketAddress);
  }
  console.log("boo1")

  // market = market as MarketDb;
  // Only updateMarket if it has not been updated this block
  if (!convertToDecimal(market.accrualBlockNumber).equals(convertToDecimal(blockNumber))) {
    let contractAddress = market.id;
    let contract = await new web3.eth.Contract(cTokenABI, contractAddress);
    let usdPriceInEth = await getUSDCPriceETH(blockNumber);

    // if cETH, only update USD price
    if (market.id == cETHAddress) {
      market.underlyingPriceUSD = convertToDecimal(market.underlyingPrice)
        .div(usdPriceInEth)
        .toDecimalPlaces(convertToDecimal(market.underlyingDecimals).toNumber());
    } else {
      let tokenPriceEth = await getTokenPrice(
        blockNumber,
        contractAddress,
        market.underlyingAddress,
        market.underlyingDecimals
      )

      market.underlyingPrice = convertToDecimal(tokenPriceEth)
        .toDecimalPlaces(convertToDecimal(market.underlyingDecimals).toNumber());

      // if USDC, only update ETH price
      if (market.id != cUSDCAddress) {
        market.underlyingPriceUSD = convertToDecimal(market.underlyingPrice)
          .div(usdPriceInEth)
          .toDecimalPlaces(convertToDecimal(market.underlyingDecimals).toNumber());
      }
    }

    let accrualBlockNumber = await contract.methods.accrualBlockNumber().call();
    market.accrualBlockNumber = convertToDecimal(accrualBlockNumber);
    market.blockTimestamp = blockTimestamp;
    let totalSupply =  await contract.methods.totalSupply().call();
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
    let underlyingDecimals = convertToDecimal(market.underlyingDecimals).toNumber();
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

    await market.save();
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
  let comptroller = await comptrollerService.getById('1');
  let oracleAddress = "";
  if (comptroller !== null) {
    oracleAddress = comptroller.priceOracle;
  }
  let priceOracle1Address = "" // todo: move to config


  let contract = await new web3.eth.Contract(cTokenABI, oracleAddress); // todo: update abi
  // let underlyingPrice = await contract.methods.oracle().call();
  // let price = await contract.methods.getUnderlyingPrice(underlyingAddress).call();
  // let underlyingPrice = convertToDecimal(price).div(mantissaFactorBD);
  // return underlyingPrice

  return ONE_BD;

}

async function getUSDCPriceETH(blockNumber: number) {
  // services
  let comptrollerService = Container.get(ComptrollerService);

  // 
  let comptroller = await comptrollerService.getById('1');
  let oracleAddress = "";
  if (comptroller !== null) {
    oracleAddress = comptroller.priceOracle;
  }
  let priceOracle1Address = "" // todo: move to config
  let USDCAddress = "" // todo: move to config


  let contract = await new web3.eth.Contract(cTokenABI, oracleAddress); // todo: update abi
  // let underlyingPrice = await contract.methods.oracle().call();
  // let price = await contract.methods.getUnderlyingPrice(underlyingAddress).call();
  // let underlyingPrice = convertToDecimal(price).div(mantissaFactorBD);
  // return underlyingPrice

  return ONE_BD;
}