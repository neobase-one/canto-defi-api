import Decimal from "decimal.js";
import Container from "typedi";
import { EventData } from "web3-eth-contract";
import {
  LiquidityPosition,
  LiquidityPositionModel,
} from "../../models/liquidityPosition";
import {
  LiquidityPositionSnapshot,
  LiquidityPositionSnapshotModel,
} from "../../models/liquidityPositionSnapshot";
import { User } from "../../models/user";
import { ONE_BD, ZERO_BD } from "../../utils/constants";
import { getTimestamp } from "../../utils/helper";
import { BundleService } from "./models/bundle";
import { LiquidityPositionService } from "./models/liquidity";
import { PairService } from "./models/pair";
import { TokenService } from "./models/token";
import { UserService } from "./models/user";

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
    pair.liquidityProviderCount = pair.liquidityProviderCount.plus(ONE_BD);
    liquidityTokenBalance = new LiquidityPosition(id);
    liquidityTokenBalance.liquidityTokenBalance = ZERO_BD;
    liquidityTokenBalance.pair = exchange;
    liquidityTokenBalance.user = user;
    liquidityTokenBalance.save();
    pair.save();
  }
  if (liquidityTokenBalance === null) {
    console.log("ERROR: LiquidityTokenBalance is null", [id]);
  }
  return liquidityTokenBalance as LiquidityPosition;
}

export async function createUser(address: string) {
  const userService = Container.get(UserService);

  let user: any = await userService.getById(address);
  if (user === null) {
    user = new User(address);
    user.usdSwapped = ZERO_BD;
    user.save();
  }
}

export async function createLiquiditySnapshot(
  position: LiquidityPosition,
  event: EventData
) {
  const timestamp: any = await getTimestamp(event.blockNumber);

  // services
  const bundleService = Container.get(BundleService);
  const pairService = Container.get(PairService);
  const tokenService = Container.get(TokenService);
  const liquidityPositionService = Container.get(LiquidityPositionService);

  let bundle: any = await bundleService.get();
  // let pair: any = await pairService.getByAddress(position.pair);
  let pair: any = await pairService.getByAddress("");
  let token0: any = await tokenService.getByAddress(pair.token0);
  let token1: any = await tokenService.getByAddress(pair.token0);

  // create new snapshot
  let snapshot = new LiquidityPositionSnapshot(
    position.id.concat(timestamp.toString())
  );
  // snapshot.liquidityPosition = position.id;
  snapshot.timestamp = timestamp;
  snapshot.blockNumber = new Decimal(event.blockNumber);
  snapshot.user = position.user;
  snapshot.pair = position.pair;
  snapshot.token0PriceUSD = token0.derivedETH.times(bundle.ethPrice);
  snapshot.token1PriceUSD = token1.derivedETH.times(bundle.ethPrice);
  snapshot.reserve0 = pair.reserve0;
  snapshot.reserve1 = pair.reserve1;
  snapshot.reserveUSD = pair.reserveUSD;
  snapshot.liquidityTokenTotalSupply = pair.totalSupply;
  snapshot.liquidityTokenBalance = position.liquidityTokenBalance;
  // snapshot.liquidityPosition = position.id;

  await new LiquidityPositionSnapshotModel(snapshot).save();
  await new LiquidityPositionModel(position).save();
}
