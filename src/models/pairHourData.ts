import { getModelForClass, Prop as Property } from "@typegoose/typegoose";
import { ObjectId } from "mongodb";
import { ObjectType, Field, ID, Float, Int } from "type-graphql";
import { DecimalScalar } from "../types/decimalScalar";
import Decimal from "decimal.js";
import { Pair } from "./pair";
import { Ref } from "../types/ref";
import { ObjectIdScalar } from "../types/objectIdScalar";
import { EMPTY_PAIR, ZERO_BD } from "../utils/constants";

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
    return new PairHourData(this)
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

  constructor (pair: PairDayDataDb) {
      this._id = pair._id;
      this.id = pair.id;
      this.hourStartUnix = pair.hourStartUnix;
      this.pair = new Pair(pair.pair);
      this.reserve0 = pair.reserve0;
      this.reserve1 = pair.reserve1;
      this.totalSupply = pair.totalSupply;
      this.reserveUSD = pair.reserveUSD;
      this.hourlyVolumeToken0 = pair.hourlyVolumeToken0;
      this.hourlyVolumeToken1 = pair.hourlyVolumeToken1;
      this.hourlyVolumeUSD = pair.hourlyVolumeUSD;
      this.hourlyTxns = pair.hourlyTxns;
  }
}

export const PairHourDataModel = getModelForClass(PairHourDataDb);
