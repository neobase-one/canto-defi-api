import { StableswapFactoryResovler } from "./factoryResolver";
import { HealthResolver } from "./healthResolver";

export const resolvers: [Function, ...Function[]] = [
  HealthResolver,
  StableswapFactoryResovler
];
