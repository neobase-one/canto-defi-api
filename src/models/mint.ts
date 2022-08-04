import { getModelForClass, Prop as Property } from "@typegoose/typegoose";
import { ObjectId } from "mongoose";
import { ObjectType, Field, ID, Float, Int } from "type-graphql";
import { DecimalScalar } from "../types/decimalScalar";
import Decimal from "decimal.js";
import { Transaction } from "./transaction";
import { Ref } from "../types/ref";
import { Pair } from "./pair";

@ObjectType()
export class Mint {
  @Field()
  @Property({ default: "", required: true })
  readonly _id: ObjectId;

  @Field((type) => ID)
  @Property({ default: "", required: true })
  id: string;

  @Field((type) => Transaction)
  @Property({ ref: Transaction, required: true })
  transaction: Ref<Transaction>;

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
  amount0: Decimal;

  @Field((type) => DecimalScalar)
  @Property({ default: new Decimal("0"), required: true })
  amount1: Decimal;

  @Field((type) => DecimalScalar)
  @Property({ default: new Decimal("0"), required: true })
  logIndex: Decimal;

  @Field((type) => DecimalScalar)
  @Property({ default: new Decimal("0"), required: true })
  amountUSD: Decimal;

  @Field((type) => DecimalScalar)
  @Property({ default: new Decimal("0"), required: true })
  feeLiquidity: Decimal;

  // todo: to, sender, feeTo - Bytes
}

export const MintModel = getModelForClass(Mint);
