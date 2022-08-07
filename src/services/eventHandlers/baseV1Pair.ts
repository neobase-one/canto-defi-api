import Decimal from "decimal.js";
import Container from "typedi";
import { Log } from "web3-core";
import { EventData } from "web3-eth-contract";
import { Config } from "../../config";
import { Pair, PairModel } from "../../models/pair";
import {
  StableswapFactory,
  StableswapFactoryModel,
} from "../../models/stableswapFactory";
import { TokenModel } from "../../models/token";
import {
  BurnEventInput,
  MintEventInput,
  SwapEventInput,
  SyncEventInput,
  TransferEventInput,
} from "../../types/event/baseV1Pair";
import { ZERO_BD } from "../../utils/constants";
import { BundleService } from "./models/bundle";
import { PairService } from "./models/pair";
import { StableswapFactoryService } from "./models/stableswapFactory";
import { TokenService } from "./models/token";

export async function mintEventHandler(
  event: EventData,
  input: MintEventInput
) {}

export async function burnEventHandler(
  event: EventData,
  input: BurnEventInput
) {}

export async function swapEventHandler(
  event: EventData,
  input: SwapEventInput
) {}

export async function transferEventHandler(
  event: EventData,
  input: TransferEventInput
) {}

export async function syncEventHandler(
  event: EventData,
  input: SyncEventInput
) {
  //
  const factoryService = Container.get(StableswapFactoryService);
  const pairService = Container.get(PairService);
  const tokenService = Container.get(TokenService);
  const bundleService = Container.get(BundleService);

  // service functions
  const FACTORY_ADDRESS = Config.contracts.baseV1Factory.addresses[0];
  const factory: any = await factoryService.getByAddress(FACTORY_ADDRESS);
  const pair: any = await pairService.getByAddress(event.address);
  const token0: any = await tokenService.getByAddress(pair.token0);
  const token1: any = await tokenService.getByAddress(pair.token1);

  // reset factory liquiuty by subtracting only tracked liquidity
  factory.totalLiquidityETH = factory.totalLiquidityETH.minus(pair.trackedReserveETH);

  // reset token total liquidity amount
  token0.totalLiquidity = token0.totalLiquidity.minus(pair.reserve0);
  token1.totalLiquidity = token1.totalLiquidity.minus(pair.reserve1);

  // todo: convertTokenToDecimal
  pair.reserve0 = ZERO_BD;
  pair.reserve1 = ZERO_BD;

  if (!pair.reserve1.equals(ZERO_BD)) {
    pair.token0Price = pair.reserve0.div(pair.reserve1);
  } else {
    pair.token0Price = ZERO_BD;
  }

  if (!pair.reserve0.equals(ZERO_BD)) {
    pair.token1Price = pair.reserve1.div(pair.reserve0);
  } else {
    pair.token1Price = ZERO_BD;
  }
  await pair.save();

  // update ETH price now that reserves could have changed
  const bundle: any = await bundleService.get();
  bundle.ethPrice = ZERO_BD; // todo: getEthPriceInUSD
  await bundle.save();

  // update derived ETH values
  // todo: findEthPerToken
  token0.derivedETH = ZERO_BD;
  token1.derivedETH = ZERO_BD;
  await token0.save();
  await token1.save();

  // get tracked liquidity - will be 0 if neither in whitelist
  let trackedLiquidityETH: Decimal;
  if (!bundle.ethPrice.equals(ZERO_BD)) {
    // todo: getTrackedLiquidityUSD
    trackedLiquidityETH = ZERO_BD;
  } else {
    trackedLiquidityETH = ZERO_BD;
  }

  // use derived amounts within pair
  pair.trackedReserveETH = trackedLiquidityETH;
  pair.reserveETH = pair.reserve0
    .times(token0.derivedAmountETH)
    .plus(pair.reserve1.times(token1.derivedETH));
  pair.reserveUSD = pair.reserveETH.times(bundle.ethPrice);

  // use tracked amounts globally
  factory.totalLiquidityETH = factory.totalLiquidityETH.plus(trackedLiquidityETH);
  factory.totalLiquidityUSD = factory.totalLiquidityETH.times(bundle.ethPrice);
  // todo: since just multiplication can try to not use USD if all calc based on ETH

  // correctly set liquidity amounts for each token
  token0.totalLiquidity = token0.totalLiquidity.plus(pair.reserve0);
  token1.totalLiquidity = token1.totalLiquidity.plus(pair.reserve1);

  // save
  await bundle.save();
  await pair.save();
  await factory.save();
  await token0.save();
  await token1.save()

}
