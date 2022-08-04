import { getModelForClass, Prop as Property } from "@typegoose/typegoose";
import { ObjectId } from "mongoose";
import { ObjectType, Field, ID, Float, Int } from "type-graphql";
import { DecimalScalar } from "../types/decimalScalar";
import Decimal from "decimal.js";
import { Token } from "./token";
import { Ref } from "../types/ref";

@ObjectType()
export class Pair {
  @Field()
  @Property({ default: "", required: true })
  readonly _id: ObjectId;

  @Field((type) => ID)
  @Property({ default: "", required: true })
  id: string;

  @Field((type) => Token)
  @Property({ ref: Token, required: true })
  token0: Ref<Token>;

  @Field((type) => Token)
  @Property({ ref: Token, required: true })
  token1: Ref<Token>;

  @Field((type) => DecimalScalar)
  @Property({ default: new Decimal("0"), required: true })
  reserve0: Decimal;

  @Field((type) => DecimalScalar)
  @Property({ default: new Decimal("0"), required: true })
  reserve1: Decimal;

  @Field((type) => DecimalScalar)
  @Property({ default: new Decimal("0"), required: true })
  totalSupply: Decimal;

  @Field((type) => DecimalScalar)
  @Property({ default: new Decimal("0"), required: true })
  reserveCANTO: Decimal;

  @Field((type) => DecimalScalar)
  @Property({ default: new Decimal("0"), required: true })
  reserveUSD: Decimal;

  @Field((type) => DecimalScalar)
  @Property({ default: new Decimal("0"), required: true })
  trackedReserveCANTO: Decimal;

  @Field((type) => DecimalScalar)
  @Property({ default: new Decimal("0"), required: true })
  token0Price: Decimal;

  @Field((type) => DecimalScalar)
  @Property({ default: new Decimal("0"), required: true })
  token1Price: Decimal;

  @Field((type) => DecimalScalar)
  @Property({ default: new Decimal("0"), required: true })
  volumeToken0: Decimal;

  @Field((type) => DecimalScalar)
  @Property({ default: new Decimal("0"), required: true })
  volumeToken1: Decimal;

  @Field((type) => DecimalScalar)
  @Property({ default: new Decimal("0"), required: true })
  volumeUSD: Decimal;

  @Field((type) => DecimalScalar)
  @Property({ default: new Decimal("0"), required: true })
  untrackedVolumeUSD: Decimal;

  @Field((type) => DecimalScalar)
  @Property({ default: new Decimal("0"), required: true })
  txCount: Decimal;

  @Field((type) => DecimalScalar)
  @Property({ default: new Decimal("0"), required: true })
  createdAtTimestamp: Decimal;

  @Field((type) => DecimalScalar)
  @Property({ default: new Decimal("0"), required: true })
  createdAtBlockNumber: Decimal;

  @Field((type) => DecimalScalar)
  @Property({ default: new Decimal("0"), required: true })
  liquidityProviderCount: Decimal;
}

export const PairModel = getModelForClass(Pair);
