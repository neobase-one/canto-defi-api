import { getModelForClass, Prop as Property } from "@typegoose/typegoose";
import { ObjectId } from "mongodb";
import { ObjectType, Field, ID, Float, Int } from "type-graphql";
import { DecimalScalar } from "../types/decimalScalar";
import Decimal from "decimal.js";
import { Token } from "./token";
import { Ref } from "../types/ref";
import { ObjectIdScalar } from "../types/objectIdScalar";
import { EMPTY_TOKEN, ZERO_BD } from "../utils/constants";

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
  @Property({ ref: ()=>Token, required: false })
  token0?: Ref<Token>; // todo: ref

  @Field((type) => Token)
  @Property({ ref: ()=>Token, required: false })
  token1?: Ref<Token>; // todo: ref

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

  constructor (id: string) {
    this._id = new ObjectId();
    this.id = id;
    this.date = new Date(0);
    this.token0 = EMPTY_TOKEN;
    this.token1 = EMPTY_TOKEN;
    this.reserve0 = ZERO_BD;
    this.reserve1 = ZERO_BD;
    this.totalSupply = ZERO_BD;
    this.reserveUSD = ZERO_BD;
    this.dailyVolumeToken0 = ZERO_BD;
    this.dailyVolumeToken1 = ZERO_BD;
    this.dailyVolumeUSD = ZERO_BD;
    this.dailyTxns = ZERO_BD;
  }
}

export const PairDayDataModel = getModelForClass(PairDayData);
