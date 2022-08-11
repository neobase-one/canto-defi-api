import { getModelForClass, Prop as Property } from "@typegoose/typegoose";
import { ObjectId } from "mongodb";
import { ObjectType, Field, ID, Float, Int } from "type-graphql";
import { DecimalScalar } from "../types/decimalScalar";
import Decimal from "decimal.js";
import { ZERO_BD } from "../utils/constants";
import { ObjectIdScalar } from "../types/objectIdScalar";

// mongo database object
export class StableswapFactoryDb {
  @Property({ default: "", required: false })
  readonly _id: ObjectId;

  @Property({default: "", required: false })
  address: string;

  @Property({ default: 0, required: false })
  pairCount: number;

  @Property({ default: new Decimal("0"), required: false })
  totalVolumeUSD: Decimal;

  @Property({ default: new Decimal("0"), required: false })
  totalVolumeETH: Decimal;

  @Property({ default: new Decimal("0"), required: false })
  untrackedVolumeUSD: Decimal;

  @Property({ default: new Decimal("0"), required: false })
  totalLiquidityUSD: Decimal;

  @Property({ default: new Decimal("0"), required: false })
  totalLiquidityETH: Decimal;

  @Property({ default: new Decimal("0"), required: false })
  txCount: Decimal;

  @Property({ default: new Decimal("0"), required: false })
  block: Decimal;


  constructor (address: string) {
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

  @Field((type) => ID, {name: "id", nullable: true})
  address: string;

  @Field((type) => Int, {nullable: true})
  pairCount: number;

  @Field((type) => DecimalScalar, {nullable: true})
  totalVolumeUSD: Decimal;

  @Field((type) => DecimalScalar, {nullable: true})
  totalVolumeETH: Decimal;

  @Field((type) => DecimalScalar, {nullable: true})
  untrackedVolumeUSD: Decimal;

  @Field((type) => DecimalScalar, {nullable: true})
  totalLiquidityUSD: Decimal;

  @Field((type) => DecimalScalar, {nullable: true})
  totalLiquidityETH: Decimal;

  @Field((type) => DecimalScalar, {nullable: true})
  txCount: Decimal;

  block: Decimal;

  constructor() {
    this._id = new ObjectId();
    this.address = "";
    this.pairCount = 0;
    this.totalVolumeUSD = ZERO_BD;
    this.totalVolumeETH = ZERO_BD;
    this.untrackedVolumeUSD = ZERO_BD;
    this.totalLiquidityUSD = ZERO_BD;
    this.totalLiquidityETH = ZERO_BD;
    this.txCount = ZERO_BD;
  }

  fromDb (swap: StableswapFactoryDb) {
    this._id = swap._id;
    this.address = swap.address;
    this.pairCount = swap.pairCount;
    this.totalVolumeUSD = swap.totalVolumeUSD;
    this.totalVolumeETH = swap.totalVolumeETH;
    this.untrackedVolumeUSD = swap.untrackedVolumeUSD;
    this.totalLiquidityUSD = swap.totalLiquidityUSD;
    this.totalLiquidityETH = swap.totalLiquidityETH;
    this.txCount = swap.txCount;
    return this;
  }

  justId(address:string){
    this.address = address;
  }
}

export const StableswapFactoryModel = getModelForClass(StableswapFactoryDb);
