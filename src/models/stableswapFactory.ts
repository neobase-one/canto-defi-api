import { getModelForClass, Prop as Property } from "@typegoose/typegoose";
import { ObjectId } from "mongodb";
import { ObjectType, Field, ID, Float, Int } from "type-graphql";
import { DecimalScalar } from "../types/decimalScalar";
import Decimal from "decimal.js";
import { ZERO_BD } from "../utils/constants";

@ObjectType()
export class StableswapFactory {
  @Field()
  @Property({ default: "", required: true })
  readonly _id: ObjectId;

  @Field((type) => ID)
  @Property({ name: "id", default: "", required: true })
  address: string;

  @Field((type) => Int)
  @Property({ default: 0, required: true })
  pairCount: number;

  @Field((type) => DecimalScalar)
  @Property({ default: new Decimal("0"), required: true })
  totalVolumeUSD: Decimal;

  @Field((type) => DecimalScalar)
  @Property({ default: new Decimal("0"), required: true })
  totalVolumeCANTO: Decimal;

  @Field((type) => DecimalScalar)
  @Property({ default: new Decimal("0"), required: true })
  untrackedVolumeUSD: Decimal;

  @Field((type) => DecimalScalar)
  @Property({ default: new Decimal("0"), required: true })
  totalLiquidityUSD: Decimal;

  @Field((type) => DecimalScalar)
  @Property({ default: new Decimal("0"), required: true })
  totalLiquidityCANTO: Decimal;

  @Field((type) => DecimalScalar)
  @Property({ default: new Decimal("0"), required: true })
  txCount: Decimal;

  @Property({ default: new Decimal("0"), required: true })
  block: Decimal;


  constructor (address: string) {
    this._id = new ObjectId();
    this.address = address;
    this.pairCount = 0;
    this.totalVolumeUSD = ZERO_BD;
    this.totalVolumeCANTO = ZERO_BD;
    this.untrackedVolumeUSD = ZERO_BD;
    this.totalLiquidityUSD = ZERO_BD;
    this.totalLiquidityCANTO = ZERO_BD;
    this.txCount = ZERO_BD;
  }
}

export const StableswapFactoryModel = getModelForClass(StableswapFactory);
