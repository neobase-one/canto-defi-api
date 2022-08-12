import { BlocksResolver } from "./blockResolver";
import { BundlesResolver } from "./bundleResolver";
import { BurnResolver } from "./burnResolver";
import { StableswapFactoryResovler } from "./factoryResolver";
import { HealthResolver } from "./healthResolver";
import { LiquidityPositionsResolver } from "./lpResolver";
import { MarketResolver } from "./marketResolver";
import { MintResolver } from "./mintResolver";
import { PairsResolver } from "./pairResolver";
import { LiquidityPositionSnapshotsResolver } from "./snapshotResolver";
import { SwapResolver } from "./swapResolver";
import { TokenDayDatasResolver } from "./tddResolver";
import { TokensResolver } from "./tokenResolver";
import { TransactionsResolver } from "./transactionResolver";
import { UniswapDayDatasResolver } from "./uddResolver";
import { UniswapFactoriesResolver } from "./uniswapFactoriesResolver";

export const resolvers: [Function, ...Function[]] = [
  HealthResolver,
  StableswapFactoryResovler,
  TokenDayDatasResolver,
  BlocksResolver,
  UniswapDayDatasResolver,
  BundlesResolver,
  PairsResolver,
  UniswapFactoriesResolver,
  TokensResolver,
  SwapResolver,
  BurnResolver,
  MintResolver,
  LiquidityPositionsResolver,
  LiquidityPositionSnapshotsResolver,
  TransactionsResolver,
  MarketResolver
];