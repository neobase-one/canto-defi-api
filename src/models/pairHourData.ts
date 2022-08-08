import { getModelForClass, Prop as Property } from "@typegoose/typegoose";
import { ObjectId } from "mongodb";
import { ObjectType, Field, ID, Float, Int } from "type-graphql";
import { DecimalScalar } from "../types/decimalScalar";
import Decimal from "decimal.js";
import { Pair } from "./pair";
import { Ref } from "../types/ref";
import { ObjectIdScalar } from "../types/objectIdScalar";
import { EMPTY_PAIR, ZERO_BD } from "../utils/constants";

@ObjectType()
export class PairHourData {
  @Field((type) => ObjectIdScalar)
  @Property({ default: "", required: false })
  readonly _id: ObjectId;

  @Field((type) => ID)
  @Property({ default: "", required: false })
  id: string;

  @Field((type) => DecimalScalar)
  @Property({ default: new Decimal("0"), required: false })
  hourStartUnix: Decimal;

  @Field((type) => Pair)
  @Property({ ref: ()=>Pair, required: false })
  pair?: Ref<Pair>; // todo

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
  hourlyVolumeToken0: Decimal;

  @Field((type) => DecimalScalar)
  @Property({ default: new Decimal("0"), required: false })
  hourlyVolumeToken1: Decimal;

  @Field((type) => DecimalScalar)
  @Property({ default: new Decimal("0"), required: false })
  hourlyVolumeUSD: Decimal;

  @Field((type) => DecimalScalar)
  @Property({ default: new Decimal("0"), required: false })
  hourlyTxns: Decimal;

  constructor (id: string) {
      this._id = new ObjectId();
      this.id = id;
      this.hourStartUnix = ZERO_BD;
      this.pair = EMPTY_PAIR;
      this.reserve0 = ZERO_BD;
      this.reserve1 = ZERO_BD;
      this.totalSupply = ZERO_BD;
      this.reserveUSD = ZERO_BD;
      this.hourlyVolumeToken0 = ZERO_BD;
      this.hourlyVolumeToken1 = ZERO_BD;
      this.hourlyVolumeUSD = ZERO_BD;
      this.hourlyTxns = ZERO_BD;
  }
}

export const PairHourDataModel = getModelForClass(PairHourData);
