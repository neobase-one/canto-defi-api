import Decimal from "decimal.js";
import Container from "typedi";
import { Log } from "web3-core";
import { Contract, EventData } from "web3-eth-contract";
import { Config } from "../../config";
import { Bundle, BundleModel } from "../../models/bundle";
import {
  StableswapFactory,
  StableswapFactoryDb,
  StableswapFactoryModel,
} from "../../models/stableswapFactory";
import { PairCreatedEventInput } from "../../types/event/baseV1Factory";
import { StableswapFactoryService } from "./models/stableswapFactory";
import { setTimeout } from "timers/promises";
import { TokenService } from "./models/token";
import { PairService } from "./models/pair";
import { fetchTokenDecimals, fetchTokenName, fetchTokenSymbol, fetchTokenTotalSupply } from "../../utils/token";
import { ZERO_BD } from "../../utils/constants";
import { getTimestamp } from "../../utils/helper";

export async function initFactoryCollection() {
  const FACTORY_ADDRESS = Config.contracts.baseV1Factory.addresses[0];
  // create new factory w address
  let factory = new StableswapFactoryDb(FACTORY_ADDRESS);
  // console.log("INIT", factory);
  await new StableswapFactoryModel(factory).save();

  // create new bundle
  let bundle = new Bundle();
  bundle.justId("1");
  // console.log(bundle);
  await new BundleModel(bundle).save();
}

export async function pairCreatedEventHandler(
  event: EventData,
  input: PairCreatedEventInput
) {
  // console.log("PC", event.blockNumber)
  const FACTORY_ADDRESS = Config.contracts.baseV1Factory.addresses[0];
  const timestamp: any = await getTimestamp(event.blockNumber);
  console.log(timestamp)

  // services
  const factoryService = Container.get(StableswapFactoryService);
  const tokenService = Container.get(TokenService);
  const pairService = Container.get(PairService);

  // update factory
  let factory: any = await factoryService.getByAddress(FACTORY_ADDRESS);
  factory.pairCount = factory.pairCount + 1;
  factory.block = new Decimal(event.blockNumber);
  // console.log(factory);
  // console.log("PC", factory);

  // create tokens
  let token0: any = await tokenService.getOrCreate(input.token0);
  token0.symbol = fetchTokenSymbol(input.token0);
  token0.name = fetchTokenName(input.token0);
  token0.totalSupply = fetchTokenTotalSupply(input.token0);
  token0.decimals = fetchTokenDecimals(input.token0);

  let token1: any = await tokenService.getOrCreate(input.token1);
  token1.symbol = fetchTokenSymbol(input.token1);
  token1.name = fetchTokenName(input.token1);
  token1.totalSupply = fetchTokenTotalSupply(input.token1);
  token1.decimals = fetchTokenDecimals(input.token1);

  // create pair
  let pair: any = await pairService.getOrCreate(input.pair);
  // pair.token0 = input.token0;
  pair.token0 = token0.id;
  pair.token1 = token1.id;
  pair.createdAtTimestamp = timestamp;
  pair.createdAtBlockNumber = new Decimal(event.blockNumber);

  // save updated objects
  await token0.save();
  await token1.save();
  await pair.save();
  await factory.save();
}
