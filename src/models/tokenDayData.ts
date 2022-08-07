import { getModelForClass, Prop as Property } from "@typegoose/typegoose";
import { ObjectId } from "mongodb";
import { ObjectType, Field, ID, Float, Int } from "type-graphql";
import { DecimalScalar } from "../types/decimalScalar";
import Decimal from "decimal.js";
import { Token } from "./token";
import { Ref } from "../types/ref";
import { ObjectIdScalar } from "../types/objectIdScalar";
import { ZERO_BD } from "../utils/constants";

@ObjectType()
export class TokenDayData {
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
  token: string; // todo: Ref

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

  constructor (id: string) {
    this._id = new ObjectId();
    this.id = id;
    this.date = new Date(0);
    this.token = "";
    this.dailyVolumeToken = ZERO_BD;
    this.dailyVolumeETH = ZERO_BD;
    this.dailyVolumeUSD = ZERO_BD;
    this.dailyTxns = ZERO_BD;
    this.totalLiquidityToken = ZERO_BD;
    this.totalLiquidityETH = ZERO_BD;
    this.totalLiquidityUSD = ZERO_BD;
    this.priceUSD = ZERO_BD;
  }
}

export const TokenDayDataModel = getModelForClass(TokenDayData);
