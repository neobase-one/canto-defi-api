import { getModelForClass, Prop as Property } from "@typegoose/typegoose";
import { ObjectId } from "mongodb";
import { ObjectType, Field, ID, Float, Int } from "type-graphql";
import { DecimalScalar } from "../types/decimalScalar";
import Decimal from "decimal.js";
import { Token } from "./token";
import { Ref } from "../types/ref";
import { ObjectIdScalar } from "../types/objectIdScalar";

@ObjectType()
export class TokenDayData {
  @Field((type) => ObjectIdScalar)
  @Property({ default: "", required: false })
  readonly _id: ObjectId;

  @Field((type) => ID)
  @Property({ default: "", required: false })
  id: string;

  @Field()
  @Property({ default: 0, required: false })
  date: Decimal;

  @Field((type) => Token)
  @Property({ ref: Token, required: false })
  token: Ref<Token>;

  @Field((type) => DecimalScalar)
  @Property({ default: new Decimal("0"), required: false })
  dailyVolumeToken: Decimal;

  @Field((type) => DecimalScalar)
  @Property({ default: new Decimal("0"), required: false })
  dailyVolumeETH: Decimal;

  @Field((type) => DecimalScalar)
  @Property({ default: new Decimal("0"), required: false })
  dailyVolumeUSD: Decimal;

  @Field((type) => DecimalScalar)
  @Property({ default: new Decimal("0"), required: false })
  dailyTxns: Decimal;

  @Field((type) => DecimalScalar)
  @Property({ default: new Decimal("0"), required: false })
  totalLiquidityToken: Decimal;

  @Field((type) => DecimalScalar)
  @Property({ default: new Decimal("0"), required: false })
  totalLiquidityETH: Decimal;

  @Field((type) => DecimalScalar)
  @Property({ default: new Decimal("0"), required: false })
  totalLiquidityUSD: Decimal;

  @Field((type) => DecimalScalar)
  @Property({ default: new Decimal("0"), required: false })
  priceUSD: Decimal;
}

export const TokenDayDataModel = getModelForClass(TokenDayData);
