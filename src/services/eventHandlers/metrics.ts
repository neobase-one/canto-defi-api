import Decimal from "decimal.js";
import Container from "typedi";
import { EventData } from "web3-eth-contract";
import { Config } from "../../config";
import { PairDayData } from "../../models/pairDayData";
import { PairHourData } from "../../models/pairHourData";
import { StableswapDayData } from "../../models/stableswapDayData";
import { StableswapFactory } from "../../models/stableswapFactory";
import { Token } from "../../models/token";
import { TokenDayData } from "../../models/tokenDayData";
import { ONE_BD, ZERO_BD } from "../../utils/constants";
import { getTimestamp } from "../../utils/helper";
import { BundleService } from "./models/bundle";
import { BurnService } from "./models/burn";
import { FactoryDayDataService } from "./models/factoryDayData";
import { MintService } from "./models/mint";
import { PairService } from "./models/pair";
import { PairDayDataService } from "./models/pairDayData";
import { PairHourDataService } from "./models/pairHourData";
import { StableswapFactoryService } from "./models/stableswapFactory";
import { TokenService } from "./models/token";
import { TokenDayDataService } from "./models/tokenDayData";
import { TransactionService } from "./models/transaction";

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
  let factory: any = await factoryService.getByAddress(FACTORY_ADDRESS);

  let factoryDayData: any = await factoryDayDataService.getById(
    dayId.toString()
  );
  if (factoryDayData === null) {
    factoryDayData = new StableswapDayData(dayId.toString());
    factoryDayData.date = dayStartTimestamp;
  }

  // update day data values
  factoryDayData.totalLiquidityETH = factory.totalLiquidityETH;
  factoryDayData.totalLiquidityETH = factory.totalLiquidityETH;
  factoryDayData.txCount = factory.txCount;

  await factoryDayData.save();

  return factoryDayData as StableswapDayData;
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
  let pair: any = await pairService.getByAddress(event.address);
  let pairDayData: any = await pairDayDataService.getById(dayPairId);
  if (pairDayData === null) {
    pairDayData = pairDayDataService.getById(dayPairId);
    pairDayData.date = dayStartTimestamp;
    pairDayData.token0 = pair.token0;
    pairDayData.token1 = pair.token1;
    pairDayData.pairAddress = event.address;
  }

  pairDayData.totalSupply = pair.totalSupply;
  pairDayData.reserve0 = pair.reserve0;
  pairDayData.reserve1 = pair.reserve1;
  pairDayData.reserveUSD = pair.reserveUSD;
  pairDayData.dailyTxns = pairDayData.dailyTxns.plus(ONE_BD);
  await pairDayData.save();

  return pairDayData as PairDayData;
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
  let pair: any = await pairService.getByAddress(event.address);
  let pairHourData: any = await pairHourDataService.getById(hourPairId);
  if (pairHourData === null) {
    pairHourData = new PairHourData(hourPairId);
    pairHourData.hourStartUnix = new Decimal(hourStartUnix);
    pairHourData.pair = event.address;
  }

  pairHourData.totalSupply = pair.totalSupply;
  pairHourData.reserve0 = pair.reserve0;
  pairHourData.reserve1 = pair.reserve1;
  pairHourData.reserveUSD = pair.reserveUSD;
  pairHourData.hourlyTxns = pairHourData.hourlyTxns.plus(ONE_BD);
  await pairHourData.save();

  return pairHourData as PairHourData;
}

export async function updateTokenDayData(token: Token, event: EventData) {
  // service
  const bundleService = Container.get(BundleService);
  const tokenDayDataService = Container.get(TokenDayDataService);

  let bundle: any = await bundleService.get();
  const timestamp: any = await getTimestamp(event.blockNumber) as number;
  let dayId = timestamp / 86400;
  let dayStartTimestamp = dayId * 86400;
  let tokenDayId = token.id.concat("-").concat(new Decimal(dayId).toString());

  let tokenDayData: any = await tokenDayDataService.getById(tokenDayId);
  if (tokenDayData === null) {
    tokenDayData = new TokenDayData(tokenDayId);
    tokenDayData.date = dayStartTimestamp;
    tokenDayData.token = token.id;
    tokenDayData.priceUSD = token.derivedETH.times(bundle.ethPrice);
  }
  tokenDayData.priceUSD = token.derivedETH.times(bundle.ethPrice);
  tokenDayData.totalLiquidityToken = token.totalLiquidity;
  tokenDayData.totalLiquidityETH = token.totalLiquidity.times(token.derivedETH);
  tokenDayData.totalLiquidityUSD = tokenDayData.totalLiquidityETH.times(
    bundle.ethPrice
  );
  tokenDayData.dailyTxns = tokenDayData.dailyTxns.plus(ONE_BD);
  tokenDayData.save();

  return tokenDayData as TokenDayData;
}
