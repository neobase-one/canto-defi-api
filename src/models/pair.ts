import { getModelForClass, Prop as Property } from "@typegoose/typegoose";
import { ObjectId } from "mongodb";
import { ObjectType, Field, ID, Float, Int } from "type-graphql";
import { DecimalScalar } from "../types/decimalScalar";
import Decimal from "decimal.js";
import { Token } from "./token";
import { Ref } from "../types/ref";
import { ObjectIdScalar } from "../types/objectIdScalar";
import { ZERO_BD } from "../utils/constants";

@ObjectType()
export class Pair {
  @Field((type) => ObjectIdScalar)
  @Property({ default: "", required: false })
  readonly _id: ObjectId;

  @Field((type) => ID)
  @Property({ default: "", required: false })
  id: string;

  @Field((type) => Token)
  @Property({ ref: Token, required: false })
  // token0: Ref<Token>;
  token0: string;

  @Field((type) => Token)
  @Property({ ref: Token, required: false })
  token1: string;

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
  reserveCANTO: Decimal;

  @Field((type) => DecimalScalar)
  @Property({ default: new Decimal("0"), required: false })
  reserveUSD: Decimal;

  @Field((type) => DecimalScalar)
  @Property({ default: new Decimal("0"), required: false })
  trackedReserveCANTO: Decimal;

  @Field((type) => DecimalScalar)
  @Property({ default: new Decimal("0"), required: false })
  token0Price: Decimal;

  @Field((type) => DecimalScalar)
  @Property({ default: new Decimal("0"), required: false })
  token1Price: Decimal;

  @Field((type) => DecimalScalar)
  @Property({ default: new Decimal("0"), required: false })
  volumeToken0: Decimal;

  @Field((type) => DecimalScalar)
  @Property({ default: new Decimal("0"), required: false })
  volumeToken1: Decimal;

  @Field((type) => DecimalScalar)
  @Property({ default: new Decimal("0"), required: false })
  volumeUSD: Decimal;

  @Field((type) => DecimalScalar)
  @Property({ default: new Decimal("0"), required: false })
  untrackedVolumeUSD: Decimal;

  @Field((type) => DecimalScalar)
  @Property({ default: new Decimal("0"), required: false })
  txCount: Decimal;

  @Field((type) => DecimalScalar)
  @Property({ default: new Decimal("0"), required: false })
  createdAtTimestamp: Decimal;

  @Field((type) => DecimalScalar)
  @Property({ default: new Decimal("0"), required: false })
  createdAtBlockNumber: Decimal;

  @Field((type) => DecimalScalar)
  @Property({ default: new Decimal("0"), required: false })
  liquidityProviderCount: Decimal;

  constructor(address: string) {
    this._id = new ObjectId();
    this.id = address;
    this.token0 = "";
    this.token1 = "";
    this.reserve0 = ZERO_BD;
    this.reserve1 = ZERO_BD;
    this.totalSupply = ZERO_BD;
    this.reserveCANTO = ZERO_BD;
    this.reserveUSD = ZERO_BD;
    this.trackedReserveCANTO = ZERO_BD;
    this.token0Price = ZERO_BD;
    this.token1Price = ZERO_BD;
    this.volumeToken0 = ZERO_BD;
    this.volumeToken1 = ZERO_BD;
    this.volumeUSD = ZERO_BD;
    this.untrackedVolumeUSD = ZERO_BD;
    this.txCount = ZERO_BD;
    this.createdAtTimestamp = ZERO_BD;
    this.createdAtBlockNumber = ZERO_BD;
    this.liquidityProviderCount = ZERO_BD;
  }
}

export const PairModel = getModelForClass(Pair);
