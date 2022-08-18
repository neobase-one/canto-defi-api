import { getModelForClass, Prop as Property } from "@typegoose/typegoose";
import Decimal from "decimal.js";
import { ObjectId } from "mongodb";
import { Field, ID, ObjectType } from "type-graphql";
import { DecimalScalar } from "../../types/decimalScalar";
import { ObjectIdScalar } from "../../types/objectIdScalar";
import { ZERO_BD } from "../../utils/constants";
import { Token } from "./token";

// mongo database object
export class TokenDayDataDb {
  readonly _id: ObjectId;

  @Property({ default: "", required: false })
  id: string;

  @Property({ default: 0, required: false })
  date: number;

  @Property({ default: "", required: false })
  token: string;

  @Property({ default: new Decimal("0"), required: false })
  dailyVolumeToken: Decimal;

  @Property({ default: new Decimal("0"), required: false })
  dailyVolumeNOTE: Decimal;

  @Property({ default: new Decimal("0"), required: false })
  dailyVolumeUSD: Decimal;

  @Property({ default: new Decimal("0"), required: false })
  dailyTxns: Decimal;

  @Property({ default: new Decimal("0"), required: false })
  totalLiquidityToken: Decimal;

  @Property({ default: new Decimal("0"), required: false })
  totalLiquidityNOTE: Decimal;

  @Property({ default: new Decimal("0"), required: false })
  totalLiquidityUSD: Decimal;

  @Property({ default: new Decimal("0"), required: false })
  priceUSD: Decimal;

  constructor(id: string) {
    this._id = new ObjectId();
    this.id = id;
    this.date = 0;
    this.token = "";
    this.dailyVolumeToken = ZERO_BD;
    this.dailyVolumeNOTE = ZERO_BD;
    this.dailyVolumeUSD = ZERO_BD;
    this.dailyTxns = ZERO_BD;
    this.totalLiquidityToken = ZERO_BD;
    this.totalLiquidityNOTE = ZERO_BD;
    this.totalLiquidityUSD = ZERO_BD;
    this.priceUSD = ZERO_BD;
  }

  toGenerated() {
    var tkn = new TokenDayData();
    return tkn.fromDb(this);
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

  @Field()
  @Property({ default: 0, required: false })
  date: number;

  @Field((type) => Token)
  token: Token; // todo: Ref

  @Field((type) => DecimalScalar)
  dailyVolumeToken: Decimal;

  @Field((type) => DecimalScalar)
  dailyVolumeNOTE: Decimal;

  @Field((type) => DecimalScalar)
  dailyVolumeUSD: Decimal;

  @Field((type) => DecimalScalar)
  dailyTxns: Decimal;

  @Field((type) => DecimalScalar)
  totalLiquidityToken: Decimal;

  @Field((type) => DecimalScalar)
  totalLiquidityNOTE: Decimal;

  @Field((type) => DecimalScalar)
  totalLiquidityUSD: Decimal;

  @Field((type) => DecimalScalar)
  priceUSD: Decimal;

  fromDb(tkn: TokenDayDataDb) {
    this._id = tkn._id;
    this.id = tkn.id;
    this.date = tkn.date;
    var t = new Token();
    t.id = tkn.token;
    this.token = t;
    this.dailyVolumeToken = tkn.dailyVolumeToken;
    this.dailyVolumeNOTE = tkn.dailyVolumeNOTE;
    this.dailyVolumeUSD = tkn.dailyVolumeUSD;
    this.dailyTxns = tkn.dailyTxns;
    this.totalLiquidityToken = tkn.totalLiquidityToken;
    this.totalLiquidityNOTE = tkn.totalLiquidityNOTE;
    this.totalLiquidityUSD = tkn.totalLiquidityUSD;
    this.priceUSD = tkn.priceUSD;
    return this;
  }

  justId(id: string) {
    this.id = id;
  }

  constructor() {
    this._id = new ObjectId();
    this.id = "";
    this.date = 0;
    this.token = new Token();
    this.dailyVolumeToken = ZERO_BD;
    this.dailyVolumeNOTE = ZERO_BD;
    this.dailyVolumeUSD = ZERO_BD;
    this.dailyTxns = ZERO_BD;
    this.totalLiquidityToken = ZERO_BD;
    this.totalLiquidityNOTE = ZERO_BD;
    this.totalLiquidityUSD = ZERO_BD;
    this.priceUSD = ZERO_BD;
  }
}
