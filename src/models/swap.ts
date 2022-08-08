import { getModelForClass, Prop as Property } from "@typegoose/typegoose";
import { ObjectId } from "mongodb";
import { ObjectType, Field, ID, Float, Int } from "type-graphql";
import { DecimalScalar } from "../types/decimalScalar";
import Decimal from "decimal.js";
import { Pair } from "./pair";
import { Ref } from "../types/ref";
import { ObjectIdScalar } from "../types/objectIdScalar";
import { EMPTY_PAIR, EMPTY_TRANSACTION, ZERO_BD } from "../utils/constants";
import { Transaction } from "./transaction";

@ObjectType()
export class Swap {
  @Field((type) => ObjectIdScalar)
  @Property({ default: "", required: false })
  readonly _id: ObjectId;

  @Field((type) => ID)
  @Property({ default: "", required: false })
  id: string;

  @Field((type) => Transaction)
  @Property({ ref: () => Transaction, required: false })
  transaction?: Ref<Transaction>; // todo: Ref

  @Field((type) => DecimalScalar)
  @Property({ default: new Decimal("0"), required: false })
  timestamp: Decimal;

  @Field((type) => Pair)
  @Property({ ref: () => Pair, required: false })
  pair?: Ref<Pair>; // todo: Ref

  @Field((type) => DecimalScalar)
  @Property({ default: new Decimal("0"), required: false })
  liquidity: Decimal;

  @Field((type) => DecimalScalar)
  @Property({ default: new Decimal("0"), required: false })
  amount0In: Decimal;

  @Field((type) => DecimalScalar)
  @Property({ default: new Decimal("0"), required: false })
  amount1In: Decimal;

  @Field((type) => DecimalScalar)
  @Property({ default: new Decimal("0"), required: false })
  amount0Out: Decimal;

  @Field((type) => DecimalScalar)
  @Property({ default: new Decimal("0"), required: false })
  amount1Out: Decimal;

  @Field((type) => DecimalScalar)
  @Property({ default: new Decimal("0"), required: false })
  logIndex: Decimal;

  @Field((type) => DecimalScalar)
  @Property({ default: new Decimal("0"), required: false })
  amountUSD: Decimal;

  // todo: transaction, pair - ref; to, sender, from - Bytes
  @Field((type) => String)
  @Property({ default: "", required: false })
  to: string;

  @Field((type) => String)
  @Property({ default: "", required: false })
  sender: string;

  @Field((type) => String)
  @Property({ default: "", required: false })
  from: string;

  constructor(id: string) {
    this._id = new ObjectId();
    this.id = id;
    this.transaction = EMPTY_TRANSACTION;
    this.timestamp = ZERO_BD;
    this.pair = EMPTY_PAIR;
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
}

export const SwapModel = getModelForClass(Swap);
