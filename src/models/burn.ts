import { getModelForClass, Prop as Property } from "@typegoose/typegoose";
import { ObjectId } from "mongodb";
import { ObjectType, Field, ID, Float, Int } from "type-graphql";
import { DecimalScalar } from "../types/decimalScalar";
import Decimal from "decimal.js";
import { Transaction } from "./transaction";
import {Ref} from '../types/ref';
import { Pair } from "./pair";
import { ObjectIdScalar } from "../types/objectIdScalar";
@ObjectType()
export class Burn {
  @Field((type) => ObjectIdScalar)
  @Property({ default: "", required: false })
  readonly _id: ObjectId;

  @Field((type) => ID)
  @Property({ default: "", required: false })
  id: string;

  @Field((type) => Transaction)
  @Property({ref: Transaction, required: false})
  transaction: Ref<Transaction>;

  @Field((type) => DecimalScalar)
  @Property({ default: new Decimal("0"), required: false })
  timestamp: Decimal;

  @Field((type) => Pair)
  @Property({ref: Pair, required: false})
  pair: Ref<Pair>;

  @Field((type) => DecimalScalar)
  @Property({ default: new Decimal("0"), required: false })
  liquidity: Decimal;

  @Field((type) => DecimalScalar)
  @Property({ default: new Decimal("0"), required: false })
  amount0: Decimal;

  @Field((type) => DecimalScalar)
  @Property({ default: new Decimal("0"), required: false })
  amount1: Decimal;

  @Field((type) => DecimalScalar)
  @Property({ default: new Decimal("0"), required: false })
  logIndex: Decimal;

  @Field((type) => DecimalScalar)
  @Property({ default: new Decimal("0"), required: false })
  amountUSD: Decimal;

  @Field((type) => DecimalScalar)
  @Property({ default: new Decimal("0"), required: false })
  feeLiquidity: Decimal;

  @Field((type) => Boolean)
  @Property({ default: false, required: false })
  needsComplete: Boolean;

  // todo: to, sender, feeTo - Bytes
}

export const BurnModel = getModelForClass(Burn);
