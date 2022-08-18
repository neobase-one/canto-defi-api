import Decimal from "decimal.js";
import Container from "typedi";
import { EventData } from "web3-eth-contract";
import { Config } from "../../../config";
import { BundleDb } from "../../../models/dex/bundle";
import { PairDb } from "../../../models/dex/pair";
import { PairDayDataDb, PairDayDataModel } from "../../../models/dex/pairDayData";
import { PairHourDataDb, PairHourDataModel } from "../../../models/dex/pairHourData";
import { StableswapDayDataDb, StableswapDayDataModel } from "../../../models/dex/stableswapDayData";
import { StableswapFactoryDb } from "../../../models/dex/stableswapFactory";
import { TokenDb } from "../../../models/dex/token";
import { TokenDayDataDb, TokenDayDataModel } from "../../../models/dex/tokenDayData";
import { ONE_BD } from "../../../utils/constants";
import { convertToDecimal, getTimestamp } from "../../../utils/helper";
import { BundleService } from "../models/bundle";
import { FactoryDayDataService } from "../models/factoryDayData";
import { PairService } from "../models/pair";
import { PairDayDataService } from "../models/pairDayData";
import { PairHourDataService } from "../models/pairHourData";
import { StableswapFactoryService } from "../models/stableswapFactory";
import { TokenDayDataService } from "../models/tokenDayData";

export async function updateFactoryDayData(event: EventData) {
  const FACTORY_ADDRESS = Config.contracts.baseV1Factory.addresses[0];

  // service
  const factoryService = Container.get(StableswapFactoryService);
  const factoryDayDataService = Container.get(FactoryDayDataService);

  //
  const timestamp: any = await getTimestamp(event.blockNumber) as number;
  let dayId = timestamp / 86400;
  let dayStartTimestamp = dayId * 86400;

  // load
  let factory: StableswapFactoryDb = await factoryService.getByAddress(FACTORY_ADDRESS) as StableswapFactoryDb;

  let factoryDayData: StableswapDayDataDb = await factoryDayDataService.getById(
    dayId.toString()
  ) as StableswapDayDataDb;
  if (factoryDayData === null) {
    factoryDayData = new StableswapDayDataDb(dayId.toString());
    factoryDayData.date = dayStartTimestamp;
    await new StableswapDayDataModel(factoryDayData).save();
  }

  // update day data values
  factoryDayData.totalLiquidityNOTE = factory.totalLiquidityNOTE;
  factoryDayData.totalLiquidityUSD = factory.totalLiquidityNOTE;
  factoryDayData.txCount = factory.txCount;

  await factoryDayDataService.save(factoryDayData);

  return factoryDayData;
}

export async function updatePairDayData(event: EventData) {
  // service
  const pairService = Container.get(PairService);
  const pairDayDataService = Container.get(PairDayDataService);

  //
  const timestamp: any = await getTimestamp(event.blockNumber) as number;
  let dayId = timestamp / 86400;
  let dayStartTimestamp = dayId * 86400;
  let dayPairId = event.address
    .concat("-")
    .concat(new Decimal(dayId).toString());

  // load
  let pair: PairDb = await pairService.getByAddress(event.address) as PairDb;
  let pairDayData: PairDayDataDb = await pairDayDataService.getById(dayPairId) as PairDayDataDb;
  if (pairDayData === null) {
    pairDayData = new PairDayDataDb(dayPairId);
    pairDayData.date = dayStartTimestamp;
    pairDayData.token0 = pair.token0;
    pairDayData.token1 = pair.token1;
    pairDayData.pair = event.address;
    await new PairDayDataModel(pairDayData).save();
  }

  pairDayData.totalSupply = pair.totalSupply;
  pairDayData.reserve0 = pair.reserve0;
  pairDayData.reserve1 = pair.reserve1;
  pairDayData.reserveUSD = pair.reserveUSD;
  pairDayData.dailyTxns = convertToDecimal(pairDayData.dailyTxns).plus(ONE_BD);
  await pairDayDataService.save(pairDayData);

  return pairDayData as PairDayDataDb;
}

export async function updatePairHourData(event: EventData) {
  // service
  const pairService = Container.get(PairService);
  const pairHourDataService = Container.get(PairHourDataService);

  //
  const timestamp: any = await getTimestamp(event.blockNumber) as number;
  let hourIndex = timestamp / 3600;
  let hourStartUnix = hourIndex * 3600;
  let hourPairId = event.address
    .concat("-")
    .concat(new Decimal(hourIndex).toString());

  // load
  let pair: PairDb = await pairService.getByAddress(event.address) as PairDb;
  let pairHourData: PairHourDataDb = await pairHourDataService.getById(hourPairId) as PairHourDataDb;
  if (pairHourData === null) {
    pairHourData = new PairHourDataDb(hourPairId);
    pairHourData.hourStartUnix = new Decimal(hourStartUnix);
    pairHourData.pair = event.address;
    await new PairHourDataModel(pairHourData).save();
  }

  pairHourData.totalSupply = pair.totalSupply;
  pairHourData.reserve0 = pair.reserve0;
  pairHourData.reserve1 = pair.reserve1;
  pairHourData.reserveUSD = pair.reserveUSD;
  pairHourData.hourlyTxns = convertToDecimal(pairHourData.hourlyTxns).plus(ONE_BD);
  await pairHourDataService.save(pairHourData);

  return pairHourData;
}

export async function updateTokenDayData(token: TokenDb, event: EventData) {
  // service
  const bundleService = Container.get(BundleService);
  const tokenDayDataService = Container.get(TokenDayDataService);

  let bundle: BundleDb = await bundleService.get() as BundleDb;
  const timestamp: any = await getTimestamp(event.blockNumber) as number;
  let dayId = timestamp / 86400;
  let dayStartTimestamp = dayId * 86400;
  let tokenDayId = token.id.concat("-").concat(new Decimal(dayId).toString());

  let tokenDayData: TokenDayDataDb = await tokenDayDataService.getById(tokenDayId) as TokenDayDataDb;
  if (tokenDayData === null) {
    tokenDayData = new TokenDayDataDb(tokenDayId);
    tokenDayData.date = dayStartTimestamp;
    tokenDayData.token = token.id;
    // tokenDayData.priceUSD = convertToDecimal(token.derivedNOTE).times(convertToDecimal(bundle.notePrice));
    tokenDayData.priceUSD = convertToDecimal(token.derivedNOTE);
    await new TokenDayDataModel(tokenDayData).save();
  }
  // tokenDayData.priceUSD = convertToDecimal(token.derivedNOTE).times(convertToDecimal(bundle.notePrice));
  tokenDayData.priceUSD = convertToDecimal(token.derivedNOTE);
  tokenDayData.totalLiquidityToken = token.totalLiquidity;
  tokenDayData.totalLiquidityNOTE = convertToDecimal(token.totalLiquidity).times(convertToDecimal(token.derivedNOTE));
  // tokenDayData.totalLiquidityUSD = convertToDecimal(tokenDayData.totalLiquidityNOTE).times(convertToDecimal(bundle.notePrice));
  tokenDayData.totalLiquidityUSD = convertToDecimal(tokenDayData.totalLiquidityNOTE);
  tokenDayData.dailyTxns = convertToDecimal(tokenDayData.dailyTxns).plus(ONE_BD);
  await tokenDayDataService.save(tokenDayData);

  return tokenDayData;
}
