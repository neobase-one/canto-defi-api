import Decimal from "decimal.js";
import Container from "typedi";
import { EventData } from "web3-eth-contract";
import {
  LiquidityPosition,
  LiquidityPositionDb,
  LiquidityPositionModel,
} from "../../../models/dex/liquidityPosition";
import {
  LiquidityPositionSnapshot,
  LiquidityPositionSnapshotDb,
  LiquidityPositionSnapshotModel,
} from "../../../models/dex/liquidityPositionSnapshot";
import { User, UserDb, UserModel } from "../../../models/dex/user";
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
  let liquidityTokenBalance: any = await liquidityPositionService.getById(id);
  if (liquidityTokenBalance === null) {
    // let pair = Pair.load(exchange.toHexString())
    let pair: any = await pairService.getByAddress(exchange);
    pair.liquidityProviderCount = new Decimal(
      pair.liquidityProviderCount.toString()
    ).plus(ONE_BD);
    liquidityTokenBalance = new LiquidityPositionDb(id);
    liquidityTokenBalance.liquidityTokenBalance = ZERO_BD;
    liquidityTokenBalance.pair = exchange;
    liquidityTokenBalance.user = user;
    liquidityTokenBalance = new LiquidityPositionModel(liquidityTokenBalance);
    await liquidityTokenBalance.save();
    await pair.save();
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

  let bundle: any = await bundleService.get();
  let pair: any = await pairService.getByAddress(position.pair);
  // let pair: any = await pairService.getByAddress("");
  let token0: any = await tokenService.getByAddress(pair.token0);
  let token1: any = await tokenService.getByAddress(pair.token0);

  // create new snapshot
  const snapshotId = position.id.concat(timestamp.toString());
  let snapshot = new LiquidityPositionSnapshotDb(snapshotId);
  // snapshot.liquidityPosition = position.id;
  snapshot.timestamp = timestamp;
  snapshot.blockNumber = new Decimal(event.blockNumber);
  snapshot.user = position.user;
  snapshot.pair = position.pair;
  const cantoPrice = new Decimal(bundle.cantoPrice.toString());
  snapshot.token0PriceUSD = new Decimal(token0.derivedCANTO.toString()).times(cantoPrice);
  snapshot.token1PriceUSD = new Decimal(token1.derivedCANTO.toString()).times(cantoPrice);
  snapshot.reserve0 = pair.reserve0;
  snapshot.reserve1 = pair.reserve1;
  snapshot.reserveUSD = pair.reserveUSD;
  snapshot.liquidityTokenTotalSupply = pair.totalSupply;
  snapshot.liquidityTokenBalance = position.liquidityTokenBalance;
  snapshot.liquidityPosition = position.id;

  await new LiquidityPositionSnapshotModel(snapshot).save();
  await new LiquidityPositionModel(position).save();
}
