/* eslint-disable prefer-const */

import Decimal from "decimal.js";
import Container from "typedi";
import { Config } from "../../../config/index.js";
import { web3 } from "../../../loaders/web3";
import { Bundle, BundleDb } from "../../../models/dex/bundle.js";
import { Pair, PairDb } from "../../../models/dex/pair";
import { TokenDb } from "../../../models/dex/token";
import { BaseV1FactoryABI } from "../../../utils/abiParser/baseV1factory";
import { ADDRESS_ZERO, ONE_BD, ZERO_BD } from "../../../utils/constants";
import { convertToDecimal } from "../../../utils/helper";
import { BundleService } from "../models/bundle";
import { PairService } from "../models/pair";
import { TokenService } from "../models/token";

// todo: fix types + imports

export async function getCantoPriceInUSD() {
  const NOTE_CANTO_PAIR = Config.canto.dexDashboard.NOTE_CANTO_PAIR;
  const pairService = Container.get(PairService);

  let notePair: any = await pairService.getByAddress(NOTE_CANTO_PAIR); // token1 = wCANTO
  
  let notePerCanto = convertToDecimal(notePair.token0Price)
  let usdPerNote = await getNotePriceInUSD();
  let usdPerCanto = notePerCanto.times(usdPerNote);

  return usdPerCanto;
}

async function getNotePriceInUSD() {
  const pairService = Container.get(PairService);
  const NOTE_USDT_PAIR = Config.canto.dexDashboard.NOTE_USDT_PAIR; // token1 = usdt
  const NOTE_USDC_PAIR = Config.canto.dexDashboard.NOTE_USDC_PAIR; // token1 = usdc

  let usdtPair: PairDb = await pairService.getByAddress(NOTE_USDT_PAIR) as PairDb;
  let usdcPair: PairDb = await pairService.getByAddress(NOTE_USDC_PAIR) as PairDb;

  if (usdtPair !== null && usdcPair !== null) {
    let totalLiquidityNOTE = convertToDecimal(usdtPair.reserve0)
      .plus(convertToDecimal(usdcPair.reserve0));
      let usdtWeight = convertToDecimal(usdtPair.reserve0).div(totalLiquidityNOTE);
    let usdcWeight = convertToDecimal(usdcPair.reserve0).div(totalLiquidityNOTE);

    let price = convertToDecimal(usdtPair.token0Price).times(usdtWeight)
      .plus(convertToDecimal(usdcPair.token0Price).times(usdcWeight));

      return price;
  } else if (usdtPair !== null) {
    return usdtPair.token0Price;
  } else if (usdcPair !== null) {
    return usdcPair.token0Price;
  } else {
    return ZERO_BD;
  }
}


/**
 * Search through graph to find derived Canto per token.
 **/
export async function findCantoPerToken(token: TokenDb) {
  const FACTORY_ADDRESS = Config.contracts.baseV1Factory.addresses[0];
  const wCANTO_ADDRESS = Config.canto.dexDashboard.wCANTO_ADDRESS;
  let WHITELIST: string[] = Config.canto.dexDashboard.WHITELIST;
  let MINIMUM_LIQUIDITY_THRESHOLD_CANTO = Config.canto.dexDashboard.MINIMUM_LIQUIDITY_THRESHOLD_CANTO;

  // services
  const pairService = Container.get(PairService);
  const tokenService = Container.get(TokenService);

  if (token.id == wCANTO_ADDRESS) {
    return ONE_BD;
  }
  // loop through whitelist and check if paired with any
  let factoryContract: any = await new web3.eth.Contract(BaseV1FactoryABI, FACTORY_ADDRESS);
  for (let i = 0; i < WHITELIST.length; ++i) {
    let pairAddress = await getPairAddress(factoryContract, token.id, WHITELIST[i]);
    // console.log("CANTO PER TOKEN: ", token.id, WHITELIST[i], pairAddress);
    if (pairAddress != ADDRESS_ZERO) {
      let pair: any = await pairService.getByAddress(pairAddress);
      if (
        pair.token0 == token.id
        // && convertToDecimal(pair.reserveCANTO).gt(MINIMUM_LIQUIDITY_THRESHOLD_CANTO)
      ) {
        let token1: any = await tokenService.getByAddress(pair.token1);
        return convertToDecimal(pair.token1Price).times(convertToDecimal(token1.derivedCANTO)); // return token1 per our token * Eth per token 1
      }
      if (
        pair.token1 == token.id
        // && convertToDecimal(pair.reserveCANTO).gt(MINIMUM_LIQUIDITY_THRESHOLD_CANTO)
      ) {
        let token0: any = await tokenService.getByAddress(pair.token0);
        return convertToDecimal(pair.token0Price).times(convertToDecimal(token0.derivedCANTO)); // return token0 per our token * CANTO per token 0
      }
    }
  }
  // console.log("L", token.id)
  return ZERO_BD; // nothing was found return 0
}

async function getPairAddress(contract: any, t0: any, ti: any) {
  let p1 = await contract.methods.getPair(t0, ti, true).call();
  let p2 = await contract.methods.getPair(t0, ti, false).call();
  if (p1 !== ADDRESS_ZERO) {
    return p1;
  } else if (p2 !== ADDRESS_ZERO) {
    return p2;
  } else {
    return ADDRESS_ZERO;
  }
}

/**
 * Accepts tokens and amounts, return tracked amount based on token whitelist
 * If one token on whitelist, return amount in that token converted to USD.
 * If both are, return average of two amounts
 * If neither is, return 0
 */
export async function getTrackedVolumeUSD(
  tokenAmount0: Decimal,
  token0: TokenDb,
  tokenAmount1: Decimal,
  token1: TokenDb,
  pair: PairDb
) {
  let WHITELIST: string[] = Config.canto.dexDashboard.WHITELIST;
  let UNTRACKED_PAIRS: string[] = Config.canto.dexDashboard.UNTRACKED_PAIRS;
  let MINIMUM_USD_THRESHOLD_NEW_PAIRS = Config.canto.dexDashboard.MINIMUM_USD_THRESHOLD_NEW_PAIRS;

  tokenAmount0 = new Decimal(tokenAmount0.toString())
  tokenAmount1 = new Decimal(tokenAmount0.toString())
  // services
  const bundleService = Container.get(BundleService);

  let bundle: BundleDb = await bundleService.get() as BundleDb;
  let price0 = convertToDecimal(token0.derivedCANTO).times(convertToDecimal(bundle.cantoPrice));
  // let price0 = convertToDecimal(token0.derivedCANTO);
  let price1 = convertToDecimal(token1.derivedCANTO).times(convertToDecimal(bundle.cantoPrice));
  // let price1 = convertToDecimal(token1.derivedCANTO);

  // dont count tracked volume on these pairs - usually rebass tokens
  if (UNTRACKED_PAIRS.includes(pair.id)) {
    return ZERO_BD;
  }

  // if less than 5 LPs, require high minimum reserve amount amount or return 0
  if (convertToDecimal(pair.liquidityProviderCount).lt(new Decimal(5))) {
    let reserve0USD = convertToDecimal(pair.reserve0).times(price0);
    let reserve1USD = convertToDecimal(pair.reserve1).times(price1);
    if (WHITELIST.includes(token0.id) && WHITELIST.includes(token1.id)) {
      if (reserve0USD.plus(reserve1USD).lt(MINIMUM_USD_THRESHOLD_NEW_PAIRS)) {
        return ZERO_BD;
      }
    }
    if (WHITELIST.includes(token0.id) && !WHITELIST.includes(token1.id)) {
      if (
        reserve0USD.times(new Decimal("2")).lt(MINIMUM_USD_THRESHOLD_NEW_PAIRS)
      ) {
        return ZERO_BD;
      }
    }
    if (!WHITELIST.includes(token0.id) && WHITELIST.includes(token1.id)) {
      if (
        reserve1USD.times(new Decimal("2")).lt(MINIMUM_USD_THRESHOLD_NEW_PAIRS)
      ) {
        return ZERO_BD;
      }
    }
  }

  // both are whitelist tokens, take average of both amounts
  if (WHITELIST.includes(token0.id) && WHITELIST.includes(token1.id)) {
    return tokenAmount0
      .times(price0)
      .plus(tokenAmount1.times(price1))
      .div(new Decimal("2"));
  }

  // take full value of the whitelisted token amount
  if (WHITELIST.includes(token0.id) && !WHITELIST.includes(token1.id)) {
    return tokenAmount0.times(price0);
  }

  // take full value of the whitelisted token amount
  if (!WHITELIST.includes(token0.id) && WHITELIST.includes(token1.id)) {
    return tokenAmount1.times(price1);
  }

  // neither token is on white list, tracked volume is 0
  return ZERO_BD;
}

/**
 * Accepts tokens and amounts, return tracked amount based on token whitelist
 * If one token on whitelist, return amount in that token converted to USD * 2.
 * If both are, return sum of two amounts
 * If neither is, return 0
 */
export async function getTrackedLiquidityUSD(
  tokenAmount0: Decimal,
  token0: TokenDb,
  tokenAmount1: Decimal,
  token1: TokenDb
) {
  let WHITELIST: string[] = Config.canto.dexDashboard.WHITELIST;

  tokenAmount0 = new Decimal(tokenAmount0.toString())
  tokenAmount1 = new Decimal(tokenAmount0.toString())

  // services
  const bundleService = Container.get(BundleService);

  let bundle: BundleDb = await bundleService.get() as BundleDb;
  let price0 = convertToDecimal(token0.derivedCANTO).times(convertToDecimal(bundle.cantoPrice));
  // let price0 = convertToDecimal(token0.derivedCANTO);
  let price1 = convertToDecimal(token1.derivedCANTO).times(convertToDecimal(bundle.cantoPrice));
  // let price1 = convertToDecimal(token1.derivedCANTO);

  // both are whitelist tokens, take average of both amounts
  if (WHITELIST.includes(token0.id) && WHITELIST.includes(token1.id)) {
    return tokenAmount0.times(price0).plus(tokenAmount1.times(price1));
  }

  // take double value of the whitelisted token amount
  if (WHITELIST.includes(token0.id) && !WHITELIST.includes(token1.id)) {
    return tokenAmount0.times(price0).times(new Decimal("2"));
  }

  // take double value of the whitelisted token amount
  if (!WHITELIST.includes(token0.id) && WHITELIST.includes(token1.id)) {
    return tokenAmount1.times(price1).times(new Decimal("2"));
  }

  // neither token is on white list, tracked volume is 0
  return ZERO_BD;
}
