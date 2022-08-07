import { getModelForClass, Prop as Property } from "@typegoose/typegoose";
import { ObjectId } from "mongoose";
import { ObjectType, Field, ID, Float, Int } from "type-graphql";
import { DecimalScalar } from "../types/decimalScalar";
import Decimal from "decimal.js";
import { ObjectIdScalar } from "../types/objectIdScalar";

@ObjectType()
export class Token {
  @Field((type) => ObjectIdScalar)
  @Property({ default: "", required: true })
  readonly _id: ObjectId;

  @Field((type) => ID)
  @Property({ default: "", required: true })
  id: string;

  @Field((type) => String)
  @Property({ default: "", required: true })
  name: string;
  
  @Field((type) => String)
  @Property({ default: "", required: true })
  symbol: string;

  @Field((type) => Int)
  @Property({ default: new Decimal("0"), required: true })
  decimals: number;

  @Field((type) => DecimalScalar)
  @Property({ default: new Decimal("0"), required: true })
  totalSupply: Decimal;

  @Field((type) => DecimalScalar)
  @Property({ default: new Decimal("0"), required: true })
  tradeVolume: Decimal;

  @Field((type) => DecimalScalar)
  @Property({ default: new Decimal("0"), required: true })
  tradeVolumeUSD: Decimal;

  @Field((type) => DecimalScalar)
  @Property({ default: new Decimal("0"), required: true })
  untrackedVolumeUSD: Decimal;

  @Field((type) => DecimalScalar)
  @Property({ default: new Decimal("0"), required: true })
  txCount: Decimal;

  @Field((type) => DecimalScalar)
  @Property({ default: new Decimal("0"), required: true })
  totalLiquididty: Decimal;

  @Field((type) => DecimalScalar)
  @Property({ default: new Decimal("0"), required: true })
  derivedCANTO: Decimal;
}

export const TokenModel = getModelForClass(Token);
