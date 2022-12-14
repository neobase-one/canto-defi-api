import Decimal from "decimal.js";

export class MintEventInput {
  sender: string;
  amount0: Decimal;
  amount1: Decimal;

  constructor(eventObj: any) {
    this.sender = eventObj[0];
    this.amount0 = new Decimal(eventObj[1]);
    this.amount1 = new Decimal(eventObj[2]);
  }
}

export class BurnEventInput {
  sender: string;
  amount0: Decimal;
  amount1: Decimal;
  to: string;

  constructor(eventObj: any) {
    this.sender = eventObj[0];
    this.amount0 = new Decimal(eventObj[1]);
    this.amount1 = new Decimal(eventObj[2]);
    this.to = eventObj[3];
  }
}

export class SwapEventInput {
  sender: string;
  amount0In: Decimal;
  amount1In: Decimal;
  amount0Out: Decimal;
  amount1Out: Decimal;
  to: string;

  constructor(eventObj: any) {
    this.sender = eventObj[0];
    this.amount0In = new Decimal(eventObj[1]);
    this.amount1In = new Decimal(eventObj[2]);
    this.amount0Out = new Decimal(eventObj[3]);
    this.amount1Out = new Decimal(eventObj[4]);
    this.to = eventObj[5];
  }
}

export class TransferEventInput {
  from: string;
  to: string;
  amount: Decimal;

  constructor(eventObj: any) {
    this.from = eventObj[0];
    this.to = eventObj[1];
    this.amount = new Decimal(eventObj[2]);
  }
}

export class SyncEventInput {
  reserve0: Decimal;
  reserve1: Decimal;

  constructor(eventObj: any) {
    this.reserve0 = new Decimal(eventObj[0]);
    this.reserve1 = new Decimal(eventObj[1]);
  }
}
