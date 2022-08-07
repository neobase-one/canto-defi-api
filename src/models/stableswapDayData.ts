import { getModelForClass, Prop as Property } from "@typegoose/typegoose";
import { ObjectId } from "mongodb";
import { ObjectType, Field, ID, Float, Int } from "type-graphql";
import { DecimalScalar } from "../types/decimalScalar";
import Decimal from "decimal.js";
import { ObjectIdScalar } from "../types/objectIdScalar";
import { ZERO_BD } from "../utils/constants";

@ObjectType()
export class StableswapDayData {
  @Field((type) => ObjectIdScalar)
  @Property({ default: "", required: false })
  readonly _id: ObjectId;

  @Field((type) => ID)
  @Property({ default: "", required: false })
  id: string;

  @Field()
  @Property({ default: new Date(), required: false })
  date: number;

  @Field((type) => DecimalScalar)
  @Property({ default: new Decimal("0"), required: false })
  dailyVolumeETH: Decimal;

  @Field((type) => DecimalScalar)
  @Property({ default: new Decimal("0"), required: false })
  dailyVolumeUSD: Decimal;

  @Field((type) => DecimalScalar)
  @Property({ default: new Decimal("0"), required: false })
  dailyVolumeUntracked: Decimal;

  @Field((type) => DecimalScalar)
  @Property({ default: new Decimal("0"), required: false })
  totalVolumeETH: Decimal;

  @Field((type) => DecimalScalar)
  @Property({ default: new Decimal("0"), required: false })
  totalLiquidityETH: Decimal;

  @Field((type) => DecimalScalar)
  @Property({ default: new Decimal("0"), required: false })
  totalVolumeUSD: Decimal;

  @Field((type) => DecimalScalar)
  @Property({ default: new Decimal("0"), required: false })
  totalLiquidityUSD: Decimal;

  @Field((type) => DecimalScalar)
  @Property({ default: new Decimal("0"), required: false })
  txCount: Decimal;

  constructor (id: string) {
    this._id = new ObjectId();
    this.id = id;
    this.date = 0;
    this.dailyVolumeETH = ZERO_BD;
    this.dailyVolumeUSD = ZERO_BD;
    this.dailyVolumeUntracked = ZERO_BD;
    this.totalVolumeETH = ZERO_BD;
    this.totalLiquidityETH = ZERO_BD;
    this.totalVolumeUSD = ZERO_BD;
    this.totalLiquidityUSD = ZERO_BD;
    this.txCount = ZERO_BD;
  }
}

export const StableswapDayDataModel = getModelForClass(StableswapDayData);
