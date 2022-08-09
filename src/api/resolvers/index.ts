import { BlocksResolver } from "./blockResolver";
import { BundlesResolver } from "./bundleResolver";
import { StableswapFactoryResovler } from "./factoryResolver";
import { HealthResolver } from "./healthResolver";
import { PairsResolver } from "./pairResolver";
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
  TokensResolver
];
