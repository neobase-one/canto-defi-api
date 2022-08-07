import { getModelForClass, Prop as Property } from "@typegoose/typegoose";
import { ObjectId } from "mongoose";
import { ObjectType, Field, ID, Float, Int } from "type-graphql";
import { DecimalScalar } from "../types/decimalScalar";
import Decimal from "decimal.js";
import { Pair } from "./pair";
import { Ref } from "../types/ref";
import { ObjectIdScalar } from "../types/objectIdScalar";

@ObjectType()
export class PairHourData {
  @Field((type) => ObjectIdScalar)
  @Property({ default: "", required: true })
  readonly _id: ObjectId;

  @Field((type) => ID)
  @Property({ default: "", required: true })
  id: string;

  @Field((type) => DecimalScalar)
  @Property({ default: new Decimal("0"), required: true })
  hourStartUnix: Decimal;

  @Field((type) => Pair)
  @Property({ ref: Pair, required: true })
  pair: Ref<Pair>;

  @Field((type) => DecimalScalar)
  @Property({ default: new Decimal("0"), required: true })
  reserve0: Decimal;

  @Field((type) => DecimalScalar)
  @Property({ default: new Decimal("0"), required: true })
  reserve1: Decimal;

  @Field((type) => DecimalScalar)
  @Property({ default: new Decimal("0"), required: true })
  totalSupply: Decimal;

  @Field((type) => DecimalScalar)
  @Property({ default: new Decimal("0"), required: true })
  reserveUSD: Decimal;

  @Field((type) => DecimalScalar)
  @Property({ default: new Decimal("0"), required: true })
  hourlyVolumeToken0: Decimal;

  @Field((type) => DecimalScalar)
  @Property({ default: new Decimal("0"), required: true })
  hourlyVolumeToken1: Decimal;

  @Field((type) => DecimalScalar)
  @Property({ default: new Decimal("0"), required: true })
  hourlyVolumeUSD: Decimal;

  @Field((type) => DecimalScalar)
  @Property({ default: new Decimal("0"), required: true })
  hourlyTxns: Decimal;
}

export const PairHourDataModel = getModelForClass(PairHourData);
