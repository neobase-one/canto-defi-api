/* eslint-disable prefer-const */ // to satisfy AS compiler

// For each division by 10, add one to exponent to truncate one significant figure
import Container from 'typedi';
import { web3 } from '../../../loaders/web3';
import { AccountDb, AccountModel } from '../../../models/lending/account';
import { AccountCTokenDb } from '../../../models/lending/accountCToken';
import { Market, MarketDb } from '../../../models/lending/market';
import { ZERO_BD } from '../../../utils/constants';
import { AccountService } from './account';
import { MarketService } from './market';
import { cTokenABI } from '../../../utils/abiParser/ctoken';
import Decimal from 'decimal.js';
import { Erc20ABI } from '../../../utils/abiParser/erc20';
import { fetchTokenDecimals, fetchTokenSymbol, fetchTokenName } from '../../../utils/dex/token';


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

export function createAccount(accountID: string): AccountDb {
  let accountDb = new AccountDb(accountID)
  accountDb.countLiquidated = ZERO_BD
  accountDb.countLiquidator = ZERO_BD
  accountDb.hasBorrowed = false
  const account = new AccountModel(accountDb);
  account.save();
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
  let cUSDCAddress = '0x39aa39c021dfbae8fac545936693ac917d5e7563'
  let cETHAddress = '0x4ddc2d193948926d02f9b1fe9e1daa0718270ed5'

  let market: MarketDb;
  let contract = new web3.eth.Contract(cTokenABI, marketAddress);
  // It is CETH, which has a slightly different interface
  if (marketAddress == cETHAddress) {
    market = new MarketDb(marketAddress);
    market.underlyingAddress = '0x0000000000000000000000000000000000000000';

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
  market.interestRateModelAddress = '0x0000000000000000000000000000000000000000';
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
  const marketService = Container.get(MarketService);
  const accountService = Container.get(AccountService);

  let marketDb: any = await marketService.getByAddress(marketAddress);
  if (marketDb == null) {
    marketDb = await createMarket(marketAddress);
  }
  let m = marketDb as MarketDb;
  // Only updateMarket if it has not been updated this block
  if (m.accrualBlockNumber.equals(blockNumber)) {
    let contractAddress = m.id;
    // let contract = web3.CToken.bind(contractAddress)
    // let usdPriceInEth = getUSDCpriceETH(blockNumber)

    // // if cETH, we only update USD price
    // if (market.id == cETHAddress) {
    //   market.underlyingPriceUSD = market.underlyingPrice
    //     .div(usdPriceInEth)
    //     .truncate(market.underlyingDecimals)
    // } else {
    //   let tokenPriceEth = getTokenPrice(
    //     blockNumber,
    //     contractAddress,
    //     market.underlyingAddress as Address,
    //     market.underlyingDecimals,
    //   )
    //   market.underlyingPrice = tokenPriceEth.truncate(market.underlyingDecimals)
    //   // if USDC, we only update ETH price
    //   if (market.id != cUSDCAddress) {
    //     market.underlyingPriceUSD = market.underlyingPrice
    //       .div(usdPriceInEth)
    //       .truncate(market.underlyingDecimals)
    //   }
    // }

    // market.accrualBlockNumber = contract.accrualBlockNumber().toI32()
    // market.blockTimestamp = blockTimestamp
    // market.totalSupply = contract
    //   .totalSupply()
    //   .toBigDecimal()
    //   .div(cTokenDecimalsBD)

    // /* Exchange rate explanation
    //    In Practice
    //     - If you call the cDAI contract on etherscan it comes back (2.0 * 10^26)
    //     - If you call the cUSDC contract on etherscan it comes back (2.0 * 10^14)
    //     - The real value is ~0.02. So cDAI is off by 10^28, and cUSDC 10^16
    //    How to calculate for tokens with different decimals
    //     - Must div by tokenDecimals, 10^market.underlyingDecimals
    //     - Must multiply by ctokenDecimals, 10^8
    //     - Must div by mantissa, 10^18
    //  */
    // market.exchangeRate = contract
    //   .exchangeRateStored()
    //   .toBigDecimal()
    //   .div(exponentToBigDecimal(market.underlyingDecimals))
    //   .times(cTokenDecimalsBD)
    //   .div(mantissaFactorBD)
    //   .truncate(mantissaFactor)
    // market.borrowIndex = contract
    //   .borrowIndex()
    //   .toBigDecimal()
    //   .div(mantissaFactorBD)
    //   .truncate(mantissaFactor)

    // market.reserves = contract
    //   .totalReserves()
    //   .toBigDecimal()
    //   .div(exponentToBigDecimal(market.underlyingDecimals))
    //   .truncate(market.underlyingDecimals)
    // market.totalBorrows = contract
    //   .totalBorrows()
    //   .toBigDecimal()
    //   .div(exponentToBigDecimal(market.underlyingDecimals))
    //   .truncate(market.underlyingDecimals)
    // market.cash = contract
    //   .getCash()
    //   .toBigDecimal()
    //   .div(exponentToBigDecimal(market.underlyingDecimals))
    //   .truncate(market.underlyingDecimals)

    // // Must convert to BigDecimal, and remove 10^18 that is used for Exp in Compound Solidity
    // market.supplyRate = contract
    //   .borrowRatePerBlock()
    //   .toBigDecimal()
    //   .times(BigDecimal.fromString('2102400'))
    //   .div(mantissaFactorBD)
    //   .truncate(mantissaFactor)

    // // This fails on only the first call to cZRX. It is unclear why, but otherwise it works.
    // // So we handle it like this.
    // let supplyRatePerBlock = contract.try_supplyRatePerBlock()
    // if (supplyRatePerBlock.reverted) {
    //   log.info('***CALL FAILED*** : cERC20 supplyRatePerBlock() reverted', [])
    //   market.borrowRate = zeroBD
    // } else {
    //   market.borrowRate = supplyRatePerBlock.value
    //     .toBigDecimal()
    //     .times(BigDecimal.fromString('2102400'))
    //     .div(mantissaFactorBD)
    //     .truncate(mantissaFactor)
    // }
    // market.save()
  }
  return m.toGenerated();
}
