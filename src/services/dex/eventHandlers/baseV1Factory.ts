import Decimal from "decimal.js";
import Container from "typedi";
import { EventData } from "web3-eth-contract";
import { Config } from "../../../config";
import { BundleDb, BundleModel } from "../../../models/dex/bundle";
import { PairDb, PairModel } from "../../../models/dex/pair";
import {
  StableswapFactoryDb,
  StableswapFactoryModel
} from "../../../models/dex/stableswapFactory";
import { TokenDb, TokenModel } from "../../../models/dex/token";
import { PairCreatedEventInput } from "../../../types/event/dex/baseV1Factory";
import { fetchTokenDecimals, fetchTokenSymbol, fetchTokenTotalSupply } from "../../../utils/dex/token";
import { getTimestamp } from "../../../utils/helper";
import { PairService } from "../models/pair";
import { StableswapFactoryService } from "../models/stableswapFactory";
import { TokenService } from "../models/token";

// export async function initFactoryCollection() {
//   const FACTORY_ADDRESS = Config.contracts.baseV1Factory.addresses[0];
//   // create new factory w address
//   let factory = new StableswapFactoryDb(FACTORY_ADDRESS);
//   // console.log("INIT", factory);
//   await new StableswapFactoryModel(factory).save();

//   // create new bundle
//   let bundle = new Bundle();
//   bundle.justId("1");
//   // console.log(bundle);
//   await new BundleModel(bundle).save();

//   // create new index
//   const START_BLOCK = Config.indexer.startBlock;
//   let index = new IndexDb(START_BLOCK);
//   await new IndexModel(index).save();
// }

export async function pairCreatedEventHandler(
  event: EventData,
  input: PairCreatedEventInput
) {
  // console.log("PC", event.blockNumber)
  const FACTORY_ADDRESS = Config.contracts.baseV1Factory.addresses[0];
  const timestamp: any = await getTimestamp(event.blockNumber);
  // console.log(timestamp)

  // services
  const factoryService = Container.get(StableswapFactoryService);
  const tokenService = Container.get(TokenService);
  const pairService = Container.get(PairService);

  // update factory
  let factory: StableswapFactoryDb = await factoryService.getByAddress(FACTORY_ADDRESS) as StableswapFactoryDb;
  if (factory === null) {
    factory = new StableswapFactoryDb(FACTORY_ADDRESS);

    let bundle = new BundleDb("1");
    // first instance in db so isNew should be true
    // new BundleModel by default sets isNew to true
    await new BundleModel(bundle).save();
  }
  factory.pairCount = factory.pairCount + 1;
  factory.block = new Decimal(event.blockNumber);
  // console.log(factory);
  // console.log("PC", factory);

  // create tokens
  let token0: TokenDb = await tokenService.getOrCreate(input.token0) as TokenDb;
  token0.symbol = await fetchTokenSymbol(input.token0);
  token0.name = token0.symbol;
  token0.totalSupply = await fetchTokenTotalSupply(input.token0);
  token0.decimals = fetchTokenDecimals(input.token0);

  let token1: TokenDb = await tokenService.getOrCreate(input.token1) as TokenDb;
  token1.symbol = await fetchTokenSymbol(input.token1);
  token1.name = token1.symbol;
  token1.totalSupply = await fetchTokenTotalSupply(input.token1);
  token1.decimals = fetchTokenDecimals(input.token1);

  // create pair
  let pair: PairDb = await pairService.getOrCreate(input.pair) as PairDb;
  // pair.token0 = input.token0;
  pair.token0 = token0.id;
  pair.token1 = token1.id;
  pair.createdAtTimestamp = timestamp;
  pair.createdAtBlockNumber = new Decimal(event.blockNumber);

  // save updated objects
  await tokenService.save(token0);
  await tokenService.save(token1);
  await pairService.save(pair);
  await factoryService.save(factory);
}
