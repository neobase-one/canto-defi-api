import { getModelForClass, Prop as Property } from "@typegoose/typegoose";
import { ObjectId } from "mongoose";
import { ObjectType, Field, ID, Float, Int } from "type-graphql";
import { DecimalScalar } from "../types/decimalScalar";
import Decimal from "decimal.js";
import { Pair } from "./pair";
import { Ref } from "../types/ref";
import { ObjectIdScalar } from "../types/objectIdScalar";

@ObjectType()
export class Swap {
  @Field((type) => ObjectIdScalar)
  @Property({ default: "", required: true })
  readonly _id: ObjectId;

  @Field((type) => ID)
  @Property({ default: "", required: true })
  id: string;

  @Field((type) => DecimalScalar)
  @Property({ default: new Decimal("0"), required: true })
  timestamp: Decimal;

  @Field((type) => Pair)
  @Property({ ref: Pair, required: true })
  pair: Ref<Pair>;

  @Field((type) => DecimalScalar)
  @Property({ default: new Decimal("0"), required: true })
  liquidity: Decimal;

  @Field((type) => DecimalScalar)
  @Property({ default: new Decimal("0"), required: true })
  amount0In: Decimal;

  @Field((type) => DecimalScalar)
  @Property({ default: new Decimal("0"), required: true })
  amount1In: Decimal;

  @Field((type) => DecimalScalar)
  @Property({ default: new Decimal("0"), required: true })
  amount0Out: Decimal;

  @Field((type) => DecimalScalar)
  @Property({ default: new Decimal("0"), required: true })
  amount1Out: Decimal;

  @Field((type) => DecimalScalar)
  @Property({ default: new Decimal("0"), required: true })
  logIndex: Decimal;

  @Field((type) => DecimalScalar)
  @Property({ default: new Decimal("0"), required: true })
  amountUSD: Decimal;

  // todo: transaction, pair - ref; to, sender, from - Bytes
}

export const SwapModel = getModelForClass(Swap);
