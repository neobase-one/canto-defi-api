import { BlocksResolver } from "./blockResolver";
import { BundlesResolver } from "./bundleResolver";
import { BurnResolver } from "./burnResolver";
import { StableswapFactoryResovler } from "./factoryResolver";
import { HealthResolver } from "./healthResolver";
import { MintResolver } from "./mintResolver";
import { PairsResolver } from "./pairResolver";
import { SwapResolver } from "./swapResolver";
import { TokenDayDatasResolver } from "./tddResolver";
import { TokensResolver } from "./tokenResolver";
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
  MintResolver
];
