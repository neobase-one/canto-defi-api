import { getModelForClass, Prop as Property } from "@typegoose/typegoose";
import { ObjectId } from "mongodb";
import { ObjectType, Field, ID, Float, Int } from "type-graphql";
import { DecimalScalar } from "../types/decimalScalar";
import Decimal from "decimal.js";
import { Pair } from "./pair";
import { Ref } from "../types/ref";
import { ObjectIdScalar } from "../types/objectIdScalar";
import { ZERO_BD } from "../utils/constants";
import { Transaction } from "./transaction";

// mongo database object
export class SwapDb {
  @Property({ default: "", required: false })
  readonly _id: ObjectId;

  @Property({ default: "", required: false })
  id: string;

  @Property({ default: "", required: false })
  transaction: string; // todo: Ref

  @Property({ default: new Decimal("0"), required: false })
  timestamp: Decimal;

  @Property({ default: "", required: false })
  pair: string; // todo: Ref

  @Property({ default: new Decimal("0"), required: false })
  liquidity: Decimal;

  @Property({ default: new Decimal("0"), required: false })
  amount0In: Decimal;

  @Property({ default: new Decimal("0"), required: false })
  amount1In: Decimal;

  @Property({ default: new Decimal("0"), required: false })
  amount0Out: Decimal;

  @Property({ default: new Decimal("0"), required: false })
  amount1Out: Decimal;

  @Property({ default: new Decimal("0"), required: false })
  logIndex: Decimal;

  @Property({ default: new Decimal("0"), required: false })
  amountUSD: Decimal;

  // todo: transaction, pair - ref; to, sender, from - Bytes
  @Property({ default: "", required: false })
  to: string;

  @Property({ default: "", required: false })
  sender: string;

  @Property({ default: "", required: false })
  from: string;

  constructor(id: string) {
    this._id = new ObjectId();
    this.id = id;
    this.transaction = "";
    this.timestamp = ZERO_BD;
    this.pair = "";
    this.liquidity = ZERO_BD;
    this.amount0In = ZERO_BD;
    this.amount1In = ZERO_BD;
    this.amount0Out = ZERO_BD;
    this.amount1Out = ZERO_BD;
    this.logIndex = ZERO_BD;
    this.amountUSD = ZERO_BD;
    this.to = "";
    this.sender = "";
    this.from = "";
  }

  toGenerated() {
    var s = new Swap()
    return s.fromDb(this);
  }
}

// graphql return object
@ObjectType()
export class Swap {
  @Field((type) => ObjectIdScalar)
  _id: ObjectId;

  @Field((type) => ID)
  id: string;

  @Field((type) => Transaction)
  transaction: Transaction; // todo: Ref

  @Field((type) => DecimalScalar)
  timestamp: Decimal;

  @Field((type) => Pair)
  pair: Pair; // todo: Ref

  @Field((type) => DecimalScalar)
  liquidity: Decimal;

  @Field((type) => DecimalScalar)
  amount0In: Decimal;

  @Field((type) => DecimalScalar)
  amount1In: Decimal;

  @Field((type) => DecimalScalar)
  amount0Out: Decimal;

  @Field((type) => DecimalScalar)
  amount1Out: Decimal;

  @Field((type) => DecimalScalar)
  logIndex: Decimal;

  @Field((type) => DecimalScalar)
  amountUSD: Decimal;

  // todo: transaction, pair - ref; to, sender, from - Bytes
  @Field((type) => String)
  to: string;

  @Field((type) => String)
  sender: string;

  @Field((type) => String)
  from: string;

  constructor() {
    this._id = new ObjectId();
    this.id = "";
    this.transaction = new Transaction();
    this.timestamp = ZERO_BD;
    this.pair = new Pair();
    this.liquidity = ZERO_BD;
    this.amount0In = ZERO_BD;
    this.amount1In = ZERO_BD;
    this.amount0Out = ZERO_BD;
    this.amount1Out = ZERO_BD;
    this.logIndex = ZERO_BD;
    this.amountUSD = ZERO_BD;
    this.to = "";
    this.sender = "";
    this.from = "";
  }

  fromDb(swap: SwapDb) {
    this._id = swap._id;
    this.id = swap.id;
    var t = new Transaction();
    t.justId(swap.transaction);
    this.transaction = t;
    this.timestamp = swap.timestamp;
    var p = new Pair();
    p.justId(swap.pair);
    this.pair = p;
    this.liquidity = swap.liquidity;
    this.amount0In = swap.amount0In;
    this.amount1In = swap.amount1In;
    this.amount0Out = swap.amount0Out;
    this.amount1Out = swap.amount1Out;
    this.logIndex = swap.logIndex;
    this.amountUSD = swap.amountUSD;
    this.to = swap.to;
    this.sender = swap.sender;
    this.from = swap.from;
  }

  justId(id: string) {
    this.id = id;
  }
}

export const SwapModel = getModelForClass(SwapDb);
