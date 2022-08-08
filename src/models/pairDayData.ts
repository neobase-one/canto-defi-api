import { getModelForClass, Prop as Property } from "@typegoose/typegoose";
import { ObjectId } from "mongodb";
import { ObjectType, Field, ID, Float, Int } from "type-graphql";
import { DecimalScalar } from "../types/decimalScalar";
import Decimal from "decimal.js";
import { Token } from "./token";
import { Ref } from "../types/ref";
import { ObjectIdScalar } from "../types/objectIdScalar";
import { EMPTY_TOKEN, ZERO_BD } from "../utils/constants";

// mongo database object
export class PairDayDataDb {
  @Property({ default: "", required: false })
  readonly _id: ObjectId;

  @Property({ default: "", required: false })
  id: string;

  @Property({ default: new Date(), required: false })
  date: Date;

  @Property({ default: "", required: false })
  token0: string; // todo: ref

  @Property({ default: "", required: false })
  token1: string; // todo: ref

  @Property({ default: new Decimal("0"), required: false })
  reserve0: Decimal;

  @Property({ default: new Decimal("0"), required: false })
  reserve1: Decimal;

  @Property({ default: new Decimal("0"), required: false })
  totalSupply: Decimal;

  @Property({ default: new Decimal("0"), required: false })
  reserveUSD: Decimal;

  @Property({ default: new Decimal("0"), required: false })
  dailyVolumeToken0: Decimal;

  @Property({ default: new Decimal("0"), required: false })
  dailyVolumeToken1: Decimal;

  @Property({ default: new Decimal("0"), required: false })
  dailyVolumeUSD: Decimal;

  @Property({ default: new Decimal("0"), required: false })
  dailyTxns: Decimal;

  constructor (id: string) {
    this._id = new ObjectId();
    this.id = id;
    this.date = new Date(0);
    this.token0 = "";
    this.token1 = "";
    this.reserve0 = ZERO_BD;
    this.reserve1 = ZERO_BD;
    this.totalSupply = ZERO_BD;
    this.reserveUSD = ZERO_BD;
    this.dailyVolumeToken0 = ZERO_BD;
    this.dailyVolumeToken1 = ZERO_BD;
    this.dailyVolumeUSD = ZERO_BD;
    this.dailyTxns = ZERO_BD;
  }

  toGenerated() {
    return new PairDayData(this)
  }
}

// graphql return object
@ObjectType()
export class PairDayData {
  @Field((type) => ObjectIdScalar)
  _id: ObjectId;

  @Field((type) => ID)
  id: string;

  @Field()
  date: Date;

  @Field((type) => Token)
  token0: Token; // todo: ref

  @Field((type) => Token)
  token1: Token; // todo: ref

  @Field((type) => DecimalScalar)
  reserve0: Decimal;

  @Field((type) => DecimalScalar)
  reserve1: Decimal;

  @Field((type) => DecimalScalar)
  totalSupply: Decimal;

  @Field((type) => DecimalScalar)
  reserveUSD: Decimal;

  @Field((type) => DecimalScalar)
  dailyVolumeToken0: Decimal;

  @Field((type) => DecimalScalar)
  dailyVolumeToken1: Decimal;

  @Field((type) => DecimalScalar)
  dailyVolumeUSD: Decimal;

  @Field((type) => DecimalScalar)
  dailyTxns: Decimal;

  constructor (pair: PairDayDataDb) {
    this._id = pair._id;
    this.id = pair.id;
    this.date = pair.date;
    var tk1 = new Token();
    var tk2 = new Token();
    tk1.justId(pair.token0);
    tk2.justId(pair.token1);
    this.token0 = tk1;
    this.token1 = tk2;
    this.reserve0 = pair.reserve0;
    this.reserve1 = pair.reserve1;
    this.totalSupply = pair.totalSupply;
    this.reserveUSD = pair.reserveUSD;
    this.dailyVolumeToken0 = pair.dailyVolumeToken0;
    this.dailyVolumeToken1 = pair.dailyVolumeToken1;
    this.dailyVolumeUSD = pair.dailyVolumeUSD;
    this.dailyTxns = pair.dailyTxns;
  }
}

export const PairDayDataModel = getModelForClass(PairDayDataDb);
