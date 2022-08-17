import { getModelForClass, Prop as Property } from "@typegoose/typegoose";
import Decimal from "decimal.js";
import { ObjectId } from "mongodb";
import { Field, ID, Int, ObjectType } from "type-graphql";
import { DecimalScalar } from "../../types/decimalScalar";
import { ObjectIdScalar } from "../../types/objectIdScalar";
import { ZERO_BD } from "../../utils/constants";

@ObjectType()
export class UniswapFactory {
  @Field((type) => ObjectIdScalar)
  @Property({ default: "", required: false })
  readonly _id: ObjectId;

  @Field((type) => ID, { name: "id", nullable: true })
  @Property({ default: "", required: false })
  address: string;

  @Field((type) => Int, { nullable: true })
  @Property({ default: 0, required: false })
  pairCount: number;

  @Field((type) => DecimalScalar, { nullable: true })
  @Property({ default: new Decimal("0"), required: false })
  totalVolumeUSD: Decimal;

  @Field((type) => DecimalScalar, { nullable: true })
  @Property({ default: new Decimal("0"), required: false })
  totalVolumeETH: Decimal;

  @Field((type) => DecimalScalar, { nullable: true })
  @Property({ default: new Decimal("0"), required: false })
  untrackedVolumeUSD: Decimal;

  @Field((type) => DecimalScalar, { nullable: true })
  @Property({ default: new Decimal("0"), required: false })
  totalLiquidityUSD: Decimal;

  @Field((type) => DecimalScalar, { nullable: true })
  @Property({ default: new Decimal("0"), required: false })
  totalLiquidityETH: Decimal;

  @Field((type) => DecimalScalar, { nullable: true })
  @Property({ default: new Decimal("0"), required: false })
  txCount: Decimal;

  @Property({ default: new Decimal("0"), required: false })
  block: Decimal;


  constructor(address: string) {
    this._id = new ObjectId();
    this.address = address;
    this.pairCount = 0;
    this.totalVolumeUSD = ZERO_BD;
    this.totalVolumeETH = ZERO_BD;
    this.untrackedVolumeUSD = ZERO_BD;
    this.totalLiquidityUSD = ZERO_BD;
    this.totalLiquidityETH = ZERO_BD;
    this.txCount = ZERO_BD;
  }
}

export const UniswapFactoryModel = getModelForClass(UniswapFactory);
