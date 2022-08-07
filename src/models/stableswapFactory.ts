import { getModelForClass, Prop as Property } from "@typegoose/typegoose";
import { ObjectId } from "mongodb";
import { ObjectType, Field, ID, Float, Int } from "type-graphql";
import { DecimalScalar } from "../types/decimalScalar";
import Decimal from "decimal.js";
import { ZERO_BD } from "../utils/constants";
import { ObjectIdScalar } from "../types/objectIdScalar";

@ObjectType()
export class StableswapFactory {
  @Field((type) => ObjectIdScalar)
  @Property({ default: "", required: false })
  readonly _id: ObjectId;

  @Field((type) => ID, {name: "id", nullable: true})
  @Property({default: "", required: false })
  address: string;

  @Field((type) => Int, {nullable: true})
  @Property({ default: 0, required: false })
  pairCount: number;

  @Field((type) => DecimalScalar, {nullable: true})
  @Property({ default: new Decimal("0"), required: false })
  totalVolumeUSD: Decimal;

  @Field((type) => DecimalScalar, {nullable: true})
  @Property({ default: new Decimal("0"), required: false })
  totalVolumeCANTO: Decimal;

  @Field((type) => DecimalScalar, {nullable: true})
  @Property({ default: new Decimal("0"), required: false })
  untrackedVolumeUSD: Decimal;

  @Field((type) => DecimalScalar, {nullable: true})
  @Property({ default: new Decimal("0"), required: false })
  totalLiquidityUSD: Decimal;

  @Field((type) => DecimalScalar, {nullable: true})
  @Property({ default: new Decimal("0"), required: false })
  totalLiquidityCANTO: Decimal;

  @Field((type) => DecimalScalar, {nullable: true})
  @Property({ default: new Decimal("0"), required: false })
  txCount: Decimal;

  @Property({ default: new Decimal("0"), required: false })
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
