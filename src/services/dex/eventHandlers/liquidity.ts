import Decimal from "decimal.js";
import Container from "typedi";
import { EventData } from "web3-eth-contract";
import { BundleDb } from "../../../models/dex/bundle";
import {
  LiquidityPositionDb,
  LiquidityPositionModel
} from "../../../models/dex/liquidityPosition";
import {
  LiquidityPositionSnapshotDb,
  LiquidityPositionSnapshotModel
} from "../../../models/dex/liquidityPositionSnapshot";
import { PairDb, PairModel } from "../../../models/dex/pair";
import { TokenDb } from "../../../models/dex/token";
import { UserDb, UserModel } from "../../../models/dex/user";
import { ONE_BD, ZERO_BD } from "../../../utils/constants";
import { getTimestamp } from "../../../utils/helper";
import { BundleService } from "../../dex/models/bundle";
import { LiquidityPositionService } from "../../dex/models/liquidity";
import { PairService } from "../../dex/models/pair";
import { TokenService } from "../../dex/models/token";
import { UserService } from "../../dex/models/user";

export async function createLiquidityPosition(exchange: string, user: string) {
  // services
  const pairService = Container.get(PairService);
  const tokenService = Container.get(TokenService);
  const liquidityPositionService = Container.get(LiquidityPositionService);

  let id = exchange.concat("-").concat(user);
  let liquidityTokenBalance: LiquidityPositionDb = await liquidityPositionService.getById(id) as LiquidityPositionDb;
  if (liquidityTokenBalance === null) {
    // let pair = Pair.load(exchange.toHexString())
    let pair: PairDb = await pairService.getByAddress(exchange) as PairDb;
    pair.liquidityProviderCount = new Decimal(
      pair.liquidityProviderCount.toString()
    ).plus(ONE_BD);
    liquidityTokenBalance = new LiquidityPositionDb(id);
    liquidityTokenBalance.liquidityTokenBalance = ZERO_BD;
    liquidityTokenBalance.pair = exchange;
    liquidityTokenBalance.user = user;
    await new LiquidityPositionModel(liquidityTokenBalance).save();
    await pairService.save(pair);
  }
  if (liquidityTokenBalance === null) {
    console.log("ERROR: LiquidityTokenBalance is null", [id]);
  }
  return liquidityTokenBalance as LiquidityPositionDb;
}

export async function createUser(address: string) {
  const userService = Container.get(UserService);

  let user: any = await userService.getById(address);
  if (user === null) {
    user = new UserDb(address);
    await new UserModel(user).save();
  }
}

export async function createLiquiditySnapshot(
  position: LiquidityPositionDb,
  event: EventData
) {
  const timestamp: any = await getTimestamp(event.blockNumber);

  // services
  const bundleService = Container.get(BundleService);
  const pairService = Container.get(PairService);
  const tokenService = Container.get(TokenService);
  const liquidityPositionService = Container.get(LiquidityPositionService);

  let bundle: BundleDb = await bundleService.get() as BundleDb;
  let pair: PairDb = await pairService.getByAddress(position.pair) as PairDb;
  // let pair: any = await pairService.getByAddress("");
  let token0: TokenDb = await tokenService.getByAddress(pair.token0) as TokenDb;
  let token1: TokenDb = await tokenService.getByAddress(pair.token0) as TokenDb;

  // create new snapshot
  const snapshotId = position.id.concat(timestamp.toString());
  let snapshot = new LiquidityPositionSnapshotDb(snapshotId);
  // snapshot.liquidityPosition = position.id;
  snapshot.timestamp = timestamp;
  snapshot.blockNumber = new Decimal(event.blockNumber);
  snapshot.user = position.user;
  snapshot.pair = position.pair;
  const notePrice = new Decimal(bundle.notePrice.toString());
  snapshot.token0PriceUSD = new Decimal(token0.derivedNOTE.toString()).times(notePrice);
  snapshot.token1PriceUSD = new Decimal(token1.derivedNOTE.toString()).times(notePrice);
  snapshot.reserve0 = pair.reserve0;
  snapshot.reserve1 = pair.reserve1;
  snapshot.reserveUSD = pair.reserveUSD;
  snapshot.liquidityTokenTotalSupply = pair.totalSupply;
  snapshot.liquidityTokenBalance = position.liquidityTokenBalance;
  snapshot.liquidityPosition = position.id;

  await new LiquidityPositionSnapshotModel(snapshot).save();
  await liquidityPositionService.save(position);
}
