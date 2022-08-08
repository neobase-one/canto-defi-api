import { BlocksResolver } from "./blockResolver";
import { BundlesResolver } from "./bundleResolver";
import { StableswapFactoryResovler } from "./factoryResolver";
import { HealthResolver } from "./healthResolver";
import { TokenDayDatasResolver } from "./tddResolver";
import { UniswapDayDatasResolver } from "./uddResolver";

export const resolvers: [Function, ...Function[]] = [
  HealthResolver,
  StableswapFactoryResovler,
  TokenDayDatasResolver,
  BlocksResolver,
  UniswapDayDatasResolver,
  BundlesResolver
];
