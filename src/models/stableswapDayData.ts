import { getModelForClass, Prop as Property } from "@typegoose/typegoose";
import { ObjectId } from "mongodb";
import { ObjectType, Field, ID, Float, Int } from "type-graphql";
import { DecimalScalar } from "../types/decimalScalar";
import Decimal from "decimal.js";
import { ObjectIdScalar } from "../types/objectIdScalar";
import { ZERO_BD } from "../utils/constants";

// mongo database object
export class StableswapDayDataDb {
  @Property({ default: "", required: false })
  readonly _id: ObjectId;

  @Property({ default: "", required: false })
  id: string;

  @Property({ default: new Date(), required: false })
  date: number;

  @Property({ default: new Decimal("0"), required: false })
  dailyVolumeETH: Decimal;

  @Property({ default: new Decimal("0"), required: false })
  dailyVolumeUSD: Decimal;

  @Property({ default: new Decimal("0"), required: false })
  dailyVolumeUntracked: Decimal;

  @Property({ default: new Decimal("0"), required: false })
  totalVolumeETH: Decimal;

  @Property({ default: new Decimal("0"), required: false })
  totalLiquidityETH: Decimal;

  @Property({ default: new Decimal("0"), required: false })
  totalVolumeUSD: Decimal;

  @Property({ default: new Decimal("0"), required: false })
  totalLiquidityUSD: Decimal;

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

  toGenerated() {
    return new StableswapDayData(this)
  }
}

// graphql return object
@ObjectType()
export class StableswapDayData {
  @Field((type) => ObjectIdScalar)
  _id: ObjectId;

  @Field((type) => ID)
  id: string;

  @Field()
  date: number;

  @Field((type) => DecimalScalar)
  dailyVolumeETH: Decimal;

  @Field((type) => DecimalScalar)
  dailyVolumeUSD: Decimal;

  @Field((type) => DecimalScalar)
  dailyVolumeUntracked: Decimal;

  @Field((type) => DecimalScalar)
  totalVolumeETH: Decimal;

  @Field((type) => DecimalScalar)
  totalLiquidityETH: Decimal;

  @Field((type) => DecimalScalar)
  totalVolumeUSD: Decimal;

  @Field((type) => DecimalScalar)
  totalLiquidityUSD: Decimal;

  @Field((type) => DecimalScalar)
  txCount: Decimal;

  constructor (swap: StableswapDayDataDb) {
    this._id = swap._id;
    this.id = swap.id;
    this.date = swap.date;
    this.dailyVolumeETH = swap.dailyVolumeETH;
    this.dailyVolumeUSD = swap.dailyVolumeUSD;
    this.dailyVolumeUntracked = swap.dailyVolumeUntracked;
    this.totalVolumeETH = swap.totalVolumeETH;
    this.totalLiquidityETH = swap.totalLiquidityETH;
    this.totalVolumeUSD = swap.totalVolumeUSD;
    this.totalLiquidityUSD = swap.totalLiquidityUSD;
    this.txCount = swap.txCount;
  }
}

export const StableswapDayDataModel = getModelForClass(StableswapDayDataDb);
