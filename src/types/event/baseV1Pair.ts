import Decimal from "decimal.js";

export class PairCreatedEventInput {
  token0: string;
  token1: string;
  stable: boolean;
  pair: string;
  int: Decimal;

  constructor(eventObj: any) {
    this.token0 = eventObj[0];
    this.token1 = eventObj[1];
    this.stable = eventObj[2];
    this.pair = eventObj[3];
    this.int = eventObj[4];
  }
}
