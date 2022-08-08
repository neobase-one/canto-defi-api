import { getModelForClass, Prop as Property } from "@typegoose/typegoose";
import { ObjectId } from "mongodb";
import { ObjectType, Field, ID, Float, Int } from "type-graphql";
import { DecimalScalar } from "../types/decimalScalar";
import Decimal from "decimal.js";
import { LiquidityPosition } from "./liquidityPosition";
import { User } from "./user";
import { Pair } from "./pair";
import { Ref } from "../types/ref";
import { ObjectIdScalar } from "../types/objectIdScalar";
import { EMPTY_PAIR, EMPTY_POSITION, EMPTY_USER, ZERO_BD } from "../utils/constants";

@ObjectType()
export class LiquidityPositionSnapshot {
  @Field((type) => ObjectIdScalar)
  @Property({ default: "", required: false })
  readonly _id: ObjectId;

  @Field((type) => ID)
  @Property({ default: "", required: false })
  id: string;

  @Field((type) => LiquidityPosition)
  @Property({ ref: () => LiquidityPosition, required: false })
  liquidityPosition?: Ref<LiquidityPosition>; // todo ref

  @Field((type) => DecimalScalar)
  @Property({ default: new Decimal("0"), required: false })
  timestamp: Decimal;

  @Field((type) => DecimalScalar)
  @Property({ default: new Decimal("0"), required: false })
  blockNumber: Decimal;

  @Field((type) => User)
  @Property({ ref: () => User, required: false })
  user?: Ref<User>; // todo ref

  @Field((type) => Pair)
  @Property({ ref:()=> Pair, required: false })
  pair?: Ref<Pair>; // todo ref

  @Field((type) => DecimalScalar)
  @Property({ default: new Decimal("0"), required: false })
  token0PriceUSD: Decimal;

  @Field((type) => DecimalScalar)
  @Property({ default: new Decimal("0"), required: false })
  token1PriceUSD: Decimal;

  @Field((type) => DecimalScalar)
  @Property({ default: new Decimal("0"), required: false })
  reserve0: Decimal;

  @Field((type) => DecimalScalar)
  @Property({ default: new Decimal("0"), required: false })
  reserve1: Decimal;

  @Field((type) => DecimalScalar)
  @Property({ default: new Decimal("0"), required: false })
  reserveUSD: Decimal;

  @Field((type) => DecimalScalar)
  @Property({ default: new Decimal("0"), required: false })
  liquidityTokenTotalSupply: Decimal;

  @Field((type) => DecimalScalar)
  @Property({ default: new Decimal("0"), required: false })
  liquidityTokenBalance: Decimal;

  constructor(id: string) {
    this._id = new ObjectId();
    this.id = id;
    this.liquidityPosition = EMPTY_POSITION;
    this.timestamp = ZERO_BD;
    this.blockNumber = ZERO_BD;
    this.user = EMPTY_USER;
    this.pair = EMPTY_PAIR;
    this.token0PriceUSD = ZERO_BD;
    this.token1PriceUSD = ZERO_BD;
    this.reserve0 = ZERO_BD;
    this.reserve1 = ZERO_BD;
    this.reserveUSD = ZERO_BD;
    this.liquidityTokenTotalSupply = ZERO_BD;
    this.liquidityTokenBalance = ZERO_BD;
  }
}

export const LiquidityPositionSnapshotModel = getModelForClass(
  LiquidityPositionSnapshot
);
