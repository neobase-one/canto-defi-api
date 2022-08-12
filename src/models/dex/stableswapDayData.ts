import { getModelForClass, Prop as Property } from "@typegoose/typegoose";
import { ObjectId } from "mongodb";
import { ObjectType, Field, ID, Float, Int } from "type-graphql";
import { DecimalScalar } from "../../types/decimalScalar";
import Decimal from "decimal.js";
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
    var s = new StableswapDayData()
    return s.fromDb(this);
  }
}

// graphql return object
@ObjectType()
export class StableswapDayData {
  @Field((type) => ObjectIdScalar, {nullable: true})
  _id: ObjectId;

  @Field((type) => ID)
  id: string;

  @Field({nullable: true})
  date: number;

  @Field((type) => DecimalScalar, {nullable: true})
  dailyVolumeETH: Decimal;

  @Field((type) => DecimalScalar, {nullable: true})
  dailyVolumeUSD: Decimal;

  @Field((type) => DecimalScalar, {nullable: true})
  dailyVolumeUntracked: Decimal;

  @Field((type) => DecimalScalar, {nullable: true})
  totalVolumeETH: Decimal;

  @Field((type) => DecimalScalar, {nullable: true})
  totalLiquidityETH: Decimal;

  @Field((type) => DecimalScalar, {nullable: true})
  totalVolumeUSD: Decimal;

  @Field((type) => DecimalScalar, {nullable: true})
  totalLiquidityUSD: Decimal;

  @Field((type) => DecimalScalar, {nullable: true})
  txCount: Decimal;

  constructor() {
    this._id = new ObjectId();
    this.id = "";
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

  fromDb (swap: StableswapDayDataDb) {
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
    return this;
  }

  justId(id:string){
    this.id = id;
  }
}

export const StableswapDayDataModel = getModelForClass(StableswapDayDataDb);
