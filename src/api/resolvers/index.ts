import { BlocksResolver } from "./dex/blockResolver";
import { BundlesResolver } from "./dex/bundleResolver";
import { BurnResolver } from "./dex/burnResolver";
import { StableswapFactoryResovler } from "./dex/factoryResolver";
import { HealthResolver } from "./dex/healthResolver";
import { LiquidityPositionsResolver } from "./dex/lpResolver";
import { MarketResolver } from "./lending/marketResolver";
import { MintResolver } from "./dex/mintResolver";
import { PairsResolver } from "./dex/pairResolver";
import { LiquidityPositionSnapshotsResolver } from "./dex/snapshotResolver";
import { SwapResolver } from "./dex/swapResolver";
import { TokenDayDatasResolver } from "./dex/tddResolver";
import { TokensResolver } from "./dex/tokenResolver";
import { TransactionsResolver } from "./dex/transactionResolver";
import { UniswapDayDatasResolver } from "./dex/uddResolver";
import { UniswapFactoriesResolver } from "./dex/uniswapFactoriesResolver";

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
