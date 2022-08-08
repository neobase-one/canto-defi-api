import { getModelForClass, Prop as Property } from "@typegoose/typegoose";
import { ObjectId } from "mongodb";
import { ObjectType, Field, ID, Float, Int } from "type-graphql";
import { DecimalScalar } from "../types/decimalScalar";
import Decimal from "decimal.js";
import { Pair } from "./pair";
import { Ref } from "../types/ref";
import { ObjectIdScalar } from "../types/objectIdScalar";
import { ZERO_BD } from "../utils/constants";

// mongo database object
export class PairHourDataDb {
  @Property({ default: "", required: false })
  readonly _id: ObjectId;

  @Property({ default: "", required: false })
  id: string;

  @Property({ default: new Decimal("0"), required: false })
  hourStartUnix: Decimal;

  @Property({ default: "", required: false })
  pair: string; // todo

  @Property({ default: new Decimal("0"), required: false })
  reserve0: Decimal;

  @Property({ default: new Decimal("0"), required: false })
  reserve1: Decimal;

  @Property({ default: new Decimal("0"), required: false })
  totalSupply: Decimal;

  @Property({ default: new Decimal("0"), required: false })
  reserveUSD: Decimal;

  @Property({ default: new Decimal("0"), required: false })
  hourlyVolumeToken0: Decimal;

  @Property({ default: new Decimal("0"), required: false })
  hourlyVolumeToken1: Decimal;

  @Property({ default: new Decimal("0"), required: false })
  hourlyVolumeUSD: Decimal;

  @Property({ default: new Decimal("0"), required: false })
  hourlyTxns: Decimal;

  constructor (id: string) {
      this._id = new ObjectId();
      this.id = id;
      this.hourStartUnix = ZERO_BD;
      this.pair = "";
      this.reserve0 = ZERO_BD;
      this.reserve1 = ZERO_BD;
      this.totalSupply = ZERO_BD;
      this.reserveUSD = ZERO_BD;
      this.hourlyVolumeToken0 = ZERO_BD;
      this.hourlyVolumeToken1 = ZERO_BD;
      this.hourlyVolumeUSD = ZERO_BD;
      this.hourlyTxns = ZERO_BD;
  }

  toGenerated() {
    var pair = new PairHourData()
    return pair.fromDb(this);
  }
}

// graphql return object
@ObjectType()
export class PairHourData {
  @Field((type) => ObjectIdScalar)
  _id: ObjectId;

  @Field((type) => ID)
  id: string;

  @Field((type) => DecimalScalar)
  hourStartUnix: Decimal;

  @Field((type) => Pair)
  pair: Pair; // todo

  @Field((type) => DecimalScalar)
  reserve0: Decimal;

  @Field((type) => DecimalScalar)
  reserve1: Decimal;

  @Field((type) => DecimalScalar)
  totalSupply: Decimal;

  @Field((type) => DecimalScalar)
  reserveUSD: Decimal;

  @Field((type) => DecimalScalar)
  hourlyVolumeToken0: Decimal;

  @Field((type) => DecimalScalar)
  hourlyVolumeToken1: Decimal;

  @Field((type) => DecimalScalar)
  hourlyVolumeUSD: Decimal;

  @Field((type) => DecimalScalar)
  hourlyTxns: Decimal;

  constructor() {
    this._id = new ObjectId();
    this.id = "";
    this.hourStartUnix = ZERO_BD;
    this.pair = new Pair();
    this.reserve0 = ZERO_BD;
    this.reserve1 = ZERO_BD;
    this.totalSupply = ZERO_BD;
    this.reserveUSD = ZERO_BD;
    this.hourlyVolumeToken0 = ZERO_BD;
    this.hourlyVolumeToken1 = ZERO_BD;
    this.hourlyVolumeUSD = ZERO_BD;
    this.hourlyTxns = ZERO_BD;
  }

  fromDb (pairDb: PairHourDataDb) {
    this._id = pairDb._id;
    this.id = pairDb.id;
    this.hourStartUnix = pairDb.hourStartUnix;
    var pair = new Pair();
    pair.justId(pairDb.pair);
    this.pair = pair;
    //this.pair = new Pair();
    this.reserve0 = pairDb.reserve0;
    this.reserve1 = pairDb.reserve1;
    this.totalSupply = pairDb.totalSupply;
    this.reserveUSD = pairDb.reserveUSD;
    this.hourlyVolumeToken0 = pairDb.hourlyVolumeToken0;
    this.hourlyVolumeToken1 = pairDb.hourlyVolumeToken1;
    this.hourlyVolumeUSD = pairDb.hourlyVolumeUSD;
    this.hourlyTxns = pairDb.hourlyTxns;
  }

  justId(id: string) {
    this.id = id;
  }
}

export const PairHourDataModel = getModelForClass(PairHourDataDb);
