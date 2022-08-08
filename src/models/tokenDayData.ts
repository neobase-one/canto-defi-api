import { getModelForClass, Prop as Property } from "@typegoose/typegoose";
import { ObjectId } from "mongodb";
import { ObjectType, Field, ID, Float, Int } from "type-graphql";
import { DecimalScalar } from "../types/decimalScalar";
import Decimal from "decimal.js";
import { Token } from "./token";
import { ObjectIdScalar } from "../types/objectIdScalar";
import { EMPTY_TOKEN, ZERO_BD } from "../utils/constants";

// mongo database object
export class TokenDayDataDb {
  readonly _id: ObjectId;

  @Property({ default: "", required: false })
  id: string;

  @Property({ default: new Date(), required: false })
  date: Date;

  @Property({ default: new Token(), required: false })
  token: Token;

  @Property({ default: new Decimal("0"), required: false })
  dailyVolumeToken: Decimal;

  @Property({ default: new Decimal("0"), required: false })
  dailyVolumeETH: Decimal;

  @Property({ default: new Decimal("0"), required: false })
  dailyVolumeUSD: Decimal;

  @Property({ default: new Decimal("0"), required: false })
  dailyTxns: Decimal;

  @Property({ default: new Decimal("0"), required: false })
  totalLiquidityToken: Decimal;

  @Property({ default: new Decimal("0"), required: false })
  totalLiquidityETH: Decimal;

  @Property({ default: new Decimal("0"), required: false })
  totalLiquidityUSD: Decimal;

  @Property({ default: new Decimal("0"), required: false })
  priceUSD: Decimal;

  constructor(id: string) {
    this._id = new ObjectId();
    this.id = id;
    this.date = new Date(0);
    this.token = EMPTY_TOKEN;
    this.dailyVolumeToken = ZERO_BD;
    this.dailyVolumeETH = ZERO_BD;
    this.dailyVolumeUSD = ZERO_BD;
    this.dailyTxns = ZERO_BD;
    this.totalLiquidityToken = ZERO_BD;
    this.totalLiquidityETH = ZERO_BD;
    this.totalLiquidityUSD = ZERO_BD;
    this.priceUSD = ZERO_BD;
  }

  toGenerated() {
    return new TokenDayData(this);
  }
}

export const TokenDayDataModel = getModelForClass(TokenDayDataDb);

// graphql return object (type Block as shown in schema.ts)
// decorator docs: https://typegraphql.com/docs/types-and-fields.html 
@ObjectType()
export class TokenDayData {
  @Field((type) => ObjectIdScalar)
  _id: ObjectId;

  @Field((type) => ID)
  id: string;

  @Field((type) => Date)
  date: Date;

  @Field((type) => Token)
  token: Token; // todo: Ref

  @Field((type) => DecimalScalar)
  dailyVolumeToken: Decimal;

  @Field((type) => DecimalScalar)
  dailyVolumeETH: Decimal;

  @Field((type) => DecimalScalar)
  dailyVolumeUSD: Decimal;

  @Field((type) => DecimalScalar)
  dailyTxns: Decimal;

  @Field((type) => DecimalScalar)
  totalLiquidityToken: Decimal;

  @Field((type) => DecimalScalar)
  totalLiquidityETH: Decimal;

  @Field((type) => DecimalScalar)
  totalLiquidityUSD: Decimal;

  @Field((type) => DecimalScalar)
  priceUSD: Decimal;

  constructor(tkn: TokenDayData) {
    this._id = tkn._id;
    this.id = tkn.id;
    this.date = tkn.date;
    this.token = new Token(tkn.token);
    this.dailyVolumeToken = tkn.dailyVolumeToken;
    this.dailyVolumeETH = tkn.dailyVolumeETH;
    this.dailyVolumeUSD = tkn.dailyVolumeUSD;
    this.dailyTxns = tkn.dailyTxns;
    this.totalLiquidityToken = tkn.totalLiquidityToken;
    this.totalLiquidityETH = tkn.totalLiquidityETH;
    this.totalLiquidityUSD = tkn.totalLiquidityUSD;
    this.priceUSD = tkn.priceUSD;
  }
}
