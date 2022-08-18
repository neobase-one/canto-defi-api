import { getModelForClass, Prop as Property } from "@typegoose/typegoose";
import Decimal from "decimal.js";
import { ObjectId } from "mongodb";
import { Field, ID, Int, ObjectType } from "type-graphql";
import { DecimalScalar } from "../../types/decimalScalar";
import { ObjectIdScalar } from "../../types/objectIdScalar";
import { ZERO_BD } from "../../utils/constants";

// mongo database object
export class StableswapFactoryDb {
  @Property({ default: "", required: false })
  readonly _id: ObjectId;

  @Property({ default: "", required: false })
  address: string;

  @Property({ default: 0, required: false })
  pairCount: number;

  @Property({ default: new Decimal("0"), required: false })
  totalVolumeUSD: Decimal;

  @Property({ default: new Decimal("0"), required: false })
  totalVolumeNOTE: Decimal;

  @Property({ default: new Decimal("0"), required: false })
  untrackedVolumeUSD: Decimal;

  @Property({ default: new Decimal("0"), required: false })
  totalLiquidityUSD: Decimal;

  @Property({ default: new Decimal("0"), required: false })
  totalLiquidityNOTE: Decimal;

  @Property({ default: new Decimal("0"), required: false })
  txCount: Decimal;

  @Property({ default: new Decimal("0"), required: false })
  block: Decimal;


  constructor(address: string) {
    this._id = new ObjectId();
    this.address = address;
    this.pairCount = 0;
    this.totalVolumeUSD = ZERO_BD;
    this.totalVolumeNOTE = ZERO_BD;
    this.untrackedVolumeUSD = ZERO_BD;
    this.totalLiquidityUSD = ZERO_BD;
    this.totalLiquidityNOTE = ZERO_BD;
    this.txCount = ZERO_BD;
  }

  toGenerated() {
    var s = new StableswapFactory()
    return s.fromDb(this);
  }
}

// graphql return object
@ObjectType()
export class StableswapFactory {
  @Field((type) => ObjectIdScalar)
  _id: ObjectId;

  @Field((type) => ID, { name: "id", nullable: true })
  address: string;

  @Field((type) => Int, { nullable: true })
  pairCount: number;

  @Field((type) => DecimalScalar, { nullable: true })
  totalVolumeUSD: Decimal;

  @Field((type) => DecimalScalar, { nullable: true })
  totalVolumeNOTE: Decimal;

  @Field((type) => DecimalScalar, { nullable: true })
  untrackedVolumeUSD: Decimal;

  @Field((type) => DecimalScalar, { nullable: true })
  totalLiquidityUSD: Decimal;

  @Field((type) => DecimalScalar, { nullable: true })
  totalLiquidityNOTE: Decimal;

  @Field((type) => DecimalScalar, { nullable: true })
  txCount: Decimal;

  block: Decimal;

  constructor() {
    this._id = new ObjectId();
    this.address = "";
    this.pairCount = 0;
    this.totalVolumeUSD = ZERO_BD;
    this.totalVolumeNOTE = ZERO_BD;
    this.untrackedVolumeUSD = ZERO_BD;
    this.totalLiquidityUSD = ZERO_BD;
    this.totalLiquidityNOTE = ZERO_BD;
    this.txCount = ZERO_BD;
  }

  fromDb(swap: StableswapFactoryDb) {
    this._id = swap._id;
    this.address = swap.address;
    this.pairCount = swap.pairCount;
    this.totalVolumeUSD = swap.totalVolumeUSD;
    this.totalVolumeNOTE = swap.totalVolumeNOTE;
    this.untrackedVolumeUSD = swap.untrackedVolumeUSD;
    this.totalLiquidityUSD = swap.totalLiquidityUSD;
    this.totalLiquidityNOTE = swap.totalLiquidityNOTE;
    this.txCount = swap.txCount;
    return this;
  }

  justId(address: string) {
    this.address = address;
  }
}

export const StableswapFactoryModel = getModelForClass(StableswapFactoryDb);
