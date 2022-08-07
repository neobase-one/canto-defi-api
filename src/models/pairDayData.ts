import { getModelForClass, Prop as Property } from "@typegoose/typegoose";
import { ObjectId } from "mongodb";
import { ObjectType, Field, ID, Float, Int } from "type-graphql";
import { DecimalScalar } from "../types/decimalScalar";
import Decimal from "decimal.js";
import { Token } from "./token";
import { Ref } from "../types/ref";
import { ObjectIdScalar } from "../types/objectIdScalar";

@ObjectType()
export class PairDayData {
  @Field((type) => ObjectIdScalar)
  @Property({ default: "", required: false })
  readonly _id: ObjectId;

  @Field((type) => ID)
  @Property({ default: "", required: false })
  id: string;

  @Field()
  @Property({ default: new Date(), required: false })
  date: Date;

  @Field((type) => Token)
  @Property({ ref: Token, required: false })
  token0: Ref<Token>;

  @Field((type) => Token)
  @Property({ ref: Token, required: false })
  token1: Ref<Token>;

  @Field((type) => DecimalScalar)
  @Property({ default: new Decimal("0"), required: false })
  reserve0: Decimal;

  @Field((type) => DecimalScalar)
  @Property({ default: new Decimal("0"), required: false })
  reserve1: Decimal;

  @Field((type) => DecimalScalar)
  @Property({ default: new Decimal("0"), required: false })
  totalSupply: Decimal;

  @Field((type) => DecimalScalar)
  @Property({ default: new Decimal("0"), required: false })
  reserveUSD: Decimal;

  @Field((type) => DecimalScalar)
  @Property({ default: new Decimal("0"), required: false })
  dailyVolumeToken0: Decimal;

  @Field((type) => DecimalScalar)
  @Property({ default: new Decimal("0"), required: false })
  dailyVolumeToken1: Decimal;

  @Field((type) => DecimalScalar)
  @Property({ default: new Decimal("0"), required: false })
  dailyVolumeUSD: Decimal;

  @Field((type) => DecimalScalar)
  @Property({ default: new Decimal("0"), required: false })
  dailyTxns: Decimal;
}

export const PairDayDataModel = getModelForClass(PairDayData);
