import { getModelForClass, Prop as Property } from "@typegoose/typegoose";
import Decimal from "decimal.js";
import { ObjectId } from "mongodb";
import { Field, ID, ObjectType } from "type-graphql";
import { DecimalScalar } from "../../types/decimalScalar";
import { ObjectIdScalar } from "../../types/objectIdScalar";
import { ZERO_BD } from "../../utils/constants";

// mongo database object
export class StableswapDayDataDb {
  @Property({ default: "", required: false })
  readonly _id: ObjectId;

  @Property({ default: "", required: false })
  id: string;

  @Property({ default: new Date(), required: false })
  date: number;

  @Property({ default: new Decimal("0"), required: false })
  dailyVolumeNOTE: Decimal;

  @Property({ default: new Decimal("0"), required: false })
  dailyVolumeUSD: Decimal;

  @Property({ default: new Decimal("0"), required: false })
  dailyVolumeUntracked: Decimal;

  @Property({ default: new Decimal("0"), required: false })
  totalVolumeNOTE: Decimal;

  @Property({ default: new Decimal("0"), required: false })
  totalLiquidityNOTE: Decimal;

  @Property({ default: new Decimal("0"), required: false })
  totalVolumeUSD: Decimal;

  @Property({ default: new Decimal("0"), required: false })
  totalLiquidityUSD: Decimal;

  @Property({ default: new Decimal("0"), required: false })
  txCount: Decimal;

  constructor(id: string) {
    this._id = new ObjectId();
    this.id = id;
    this.date = 0;
    this.dailyVolumeNOTE = ZERO_BD;
    this.dailyVolumeUSD = ZERO_BD;
    this.dailyVolumeUntracked = ZERO_BD;
    this.totalVolumeNOTE = ZERO_BD;
    this.totalLiquidityNOTE = ZERO_BD;
    this.totalVolumeUSD = ZERO_BD;
    this.totalLiquidityUSD = ZERO_BD;
    this.txCount = ZERO_BD;
  }

  toGenerated() {
    var s = new StableswapDayData()
    return s.fromDb(this);
  }
}

// graphql return object
@ObjectType()
export class StableswapDayData {
  @Field((type) => ObjectIdScalar, { nullable: true })
  _id: ObjectId;

  @Field((type) => ID)
  id: string;

  @Field({ nullable: true })
  date: number;

  @Field((type) => DecimalScalar, { nullable: true })
  dailyVolumeNOTE: Decimal;

  @Field((type) => DecimalScalar, { nullable: true })
  dailyVolumeUSD: Decimal;

  @Field((type) => DecimalScalar, { nullable: true })
  dailyVolumeUntracked: Decimal;

  @Field((type) => DecimalScalar, { nullable: true })
  totalVolumeNOTE: Decimal;

  @Field((type) => DecimalScalar, { nullable: true })
  totalLiquidityNOTE: Decimal;

  @Field((type) => DecimalScalar, { nullable: true })
  totalVolumeUSD: Decimal;

  @Field((type) => DecimalScalar, { nullable: true })
  totalLiquidityUSD: Decimal;

  @Field((type) => DecimalScalar, { nullable: true })
  txCount: Decimal;

  constructor() {
    this._id = new ObjectId();
    this.id = "";
    this.date = 0;
    this.dailyVolumeNOTE = ZERO_BD;
    this.dailyVolumeUSD = ZERO_BD;
    this.dailyVolumeUntracked = ZERO_BD;
    this.totalVolumeNOTE = ZERO_BD;
    this.totalLiquidityNOTE = ZERO_BD;
    this.totalVolumeUSD = ZERO_BD;
    this.totalLiquidityUSD = ZERO_BD;
    this.txCount = ZERO_BD;
  }

  fromDb(swap: StableswapDayDataDb) {
    this._id = swap._id;
    this.id = swap.id;
    this.date = swap.date;
    this.dailyVolumeNOTE = swap.dailyVolumeNOTE;
    this.dailyVolumeUSD = swap.dailyVolumeUSD;
    this.dailyVolumeUntracked = swap.dailyVolumeUntracked;
    this.totalVolumeNOTE = swap.totalVolumeNOTE;
    this.totalLiquidityNOTE = swap.totalLiquidityNOTE;
    this.totalVolumeUSD = swap.totalVolumeUSD;
    this.totalLiquidityUSD = swap.totalLiquidityUSD;
    this.txCount = swap.txCount;
    return this;
  }

  justId(id: string) {
    this.id = id;
  }
}

export const StableswapDayDataModel = getModelForClass(StableswapDayDataDb);
