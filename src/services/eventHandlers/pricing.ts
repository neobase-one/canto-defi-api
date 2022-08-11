/* eslint-disable prefer-const */

import Decimal from "decimal.js";
import Container from "typedi";
import { web3 } from "../../loaders/web3";
import { Pair, PairDb } from "../../models/pair";
import { StableswapFactory } from "../../models/stableswapFactory";
import { Token, TokenDb } from "../../models/token";
import { BaseV1FactoryABI } from "../../utils/abiParser/baseV1factory";
import { ADDRESS_ZERO, ONE_BD, ZERO_BD } from "../../utils/constants";
import { BundleService } from "./models/bundle";
import { PairService } from "./models/pair";
import { TokenService } from "./models/token";
import { Config } from "../../config/index.js";
import { convertToDecimal } from "../../utils/helper";

// todo: fix types + imports

const wCANTO_ADDRESS = Config.canto.dexDashboard.wCANTO_ADDRESS;

const NOTE_CANTO_PAIR = Config.canto.dexDashboard.NOTE_CANTO_PAIR;
const CANTO_ETH_PAIR = Config.canto.dexDashboard.CANTO_ETH_PAIR;
const CANTO_ATOM_PAIR = Config.canto.dexDashboard.CANTO_ATOM_PAIR;

export async function getEthPriceInUSD() {
  const pairService = Container.get(PairService);

  let notePair: any = await pairService.getByAddress(NOTE_CANTO_PAIR); // token1 = wCANTO
  let ethPair: any = await pairService.getByAddress(CANTO_ETH_PAIR); // token1 = wCANTO
  let atomPair: any = await pairService.getByAddress(CANTO_ATOM_PAIR); // token0 = wCANTO

  // all 3 created
  if (notePair!==null && ethPair!==null && atomPair!==null) {
    let totalLiquidityCANTO = convertToDecimal(notePair.reserve1)
      .plus(convertToDecimal(ethPair.reserve1))
      .plus(convertToDecimal(atomPair.reserve0));

    let noteWeight = convertToDecimal(notePair.reserve1).div(totalLiquidityCANTO);
    let ethWeight = convertToDecimal(ethPair.reserve1).div(totalLiquidityCANTO);
    let atomWeight = convertToDecimal(atomPair.reserve0).div(totalLiquidityCANTO);

    let price = convertToDecimal(notePair.token0Price).times(noteWeight)
      .plus(convertToDecimal(ethPair.token0Price).times(ethWeight))
      .plus(convertToDecimal(atomPair.token1Price).times(atomWeight));

    return price;
    // ETH & NOTE created
  } else if (ethPair!==null && notePair!==null) {
    let totalLiquidityCANTO = convertToDecimal(notePair.reserve1)
      .plus(convertToDecimal(ethPair.reserve1));

    let noteWeight = convertToDecimal(notePair.reserve1).div(totalLiquidityCANTO);
    let ethWeight = convertToDecimal(ethPair.reserve1).div(totalLiquidityCANTO);

    let price = convertToDecimal(notePair.token0Price).times(noteWeight)
      .plus(convertToDecimal(ethPair.token0Price).times(ethWeight));

    return price;
    // NOTE created
  } else if (notePair!==null) {
    return convertToDecimal(notePair.token0Price);
  } else {
    return ZERO_BD;
  }

  return ONE_BD; // todo: verify calc
}

// token where amounts should contribute to tracked volume and liquidity
let WHITELIST: string[] = Config.canto.dexDashboard.WHITELIST;

export let UNTRACKED_PAIRS: string[] = Config.canto.dexDashboard.UNTRACKED_PAIRS;

// minimum liquidity required to count towards tracked volume for pairs with small # of Lps
let MINIMUM_USD_THRESHOLD_NEW_PAIRS = Config.canto.dexDashboard.MINIMUM_USD_THRESHOLD_NEW_PAIRS;

// minimum liquidity for price to get tracked
let MINIMUM_LIQUIDITY_THRESHOLD_ETH = Config.canto.dexDashboard.MINIMUM_LIQUIDITY_THRESHOLD_ETH;

/**
 * Search through graph to find derived Eth per token.
 **/
export async function findEthPerToken(token: TokenDb) {
  const FACTORY_ADDRESS = Config.contracts.baseV1Factory.addresses[0];

  // services
  const pairService = Container.get(PairService);
  const tokenService = Container.get(TokenService);

  if (token.id == wCANTO_ADDRESS) {
    return ONE_BD;
  }
  // loop through whitelist and check if paired with any
  for (let i = 0; i < WHITELIST.length; ++i) {
    let factoryContract: any = await new web3.eth.Contract(BaseV1FactoryABI, FACTORY_ADDRESS);
    let pairAddress = await factoryContract.methods.getPair(token.id, WHITELIST[i], true).call();
    if (pairAddress != ADDRESS_ZERO) {
      let pair: any = await pairService.getByAddress(pairAddress);
      if (
        pair.token0 == token.id &&
        convertToDecimal(pair.reserveETH).gt(MINIMUM_LIQUIDITY_THRESHOLD_ETH)
      ) {
        let token1: any = await tokenService.getByAddress(pair.token1);
        return convertToDecimal(pair.token1Price).times(convertToDecimal(token1.derivedETH)); // return token1 per our token * Eth per token 1
      }
      if (
        pair.token1 == token.id &&
        convertToDecimal(pair.reserveETH).gt(MINIMUM_LIQUIDITY_THRESHOLD_ETH)
      ) {
        let token0: any = await tokenService.getByAddress(pair.token0);
        return convertToDecimal(pair.token0Price).times(convertToDecimal(token0.derivedETH)); // return token0 per our token * ETH per token 0
      }
    }
  }
  return ZERO_BD; // nothing was found return 0
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
  tokenAmount0 = new Decimal(tokenAmount0.toString())
  tokenAmount1 = new Decimal(tokenAmount0.toString())
  // services
  const bundleService = Container.get(BundleService);

  let bundle: any = await bundleService.get();
  let price0 = convertToDecimal(token0.derivedETH).times(convertToDecimal(bundle.ethPrice));
  let price1 = convertToDecimal(token1.derivedETH).times(convertToDecimal(bundle.ethPrice));

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
  tokenAmount0 = new Decimal(tokenAmount0.toString())
  tokenAmount1 = new Decimal(tokenAmount0.toString())
  
  // services
  const bundleService = Container.get(BundleService);

  let bundle: any = await bundleService.get();
  let price0 = convertToDecimal(token0.derivedETH).times(convertToDecimal(bundle.ethPrice));
  let price1 = convertToDecimal(token1.derivedETH).times(convertToDecimal(bundle.ethPrice));

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
