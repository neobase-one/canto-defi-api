import { BlocksResolver } from "./blockResolver";
import { StableswapFactoryResovler } from "./factoryResolver";
import { HealthResolver } from "./healthResolver";
import { TokenDayDatasResolver } from "./tddResolver";

export const resolvers: [Function, ...Function[]] = [
  HealthResolver,
  StableswapFactoryResovler,
  TokenDayDatasResolver,
  BlocksResolver
];
