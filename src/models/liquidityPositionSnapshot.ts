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

// mongo database object
export class LiquidityPositionSnapshotDb {
  @Property({ default: "", required: false })
  readonly _id: ObjectId;

  @Property({ default: "", required: false })
  id: string;

  @Property({ ref: () => LiquidityPosition, required: false })
  liquidityPosition: string; // todo ref

  @Property({ default: new Decimal("0"), required: false })
  timestamp: Decimal;

  @Property({ default: new Decimal("0"), required: false })
  blockNumber: Decimal;

  @Property({ ref: () => User, required: false })
  user: string; // todo ref

  @Property({ ref:()=> Pair, required: false })
  pair: string; // todo ref

  @Property({ default: new Decimal("0"), required: false })
  token0PriceUSD: Decimal;

  @Property({ default: new Decimal("0"), required: false })
  token1PriceUSD: Decimal;

  @Property({ default: new Decimal("0"), required: false })
  reserve0: Decimal;

  @Property({ default: new Decimal("0"), required: false })
  reserve1: Decimal;

  @Property({ default: new Decimal("0"), required: false })
  reserveUSD: Decimal;

  @Property({ default: new Decimal("0"), required: false })
  liquidityTokenTotalSupply: Decimal;

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

  toGenerated() {
    return new LiquidityPositionSnapshot(this)
  }
}

// graphql return object (type Block as shown in schema.ts)
@ObjectType()
export class LiquidityPositionSnapshot {
  @Field((type) => ObjectIdScalar)
  _id: ObjectId;

  @Field((type) => ID)
  id: string;

  @Field((type) => LiquidityPosition)
  liquidityPosition: LiquidityPosition; // todo ref

  @Field((type) => DecimalScalar)
  timestamp: Decimal;

  @Field((type) => DecimalScalar)
  blockNumber: Decimal;

  @Field((type) => User)
  user: User; // todo ref

  @Field((type) => Pair)
  pair: Pair; // todo ref

  @Field((type) => DecimalScalar)
  token0PriceUSD: Decimal;

  @Field((type) => DecimalScalar)
  token1PriceUSD: Decimal;

  @Field((type) => DecimalScalar)
  reserve0: Decimal;

  @Field((type) => DecimalScalar)
  reserve1: Decimal;

  @Field((type) => DecimalScalar)
  reserveUSD: Decimal;

  @Field((type) => DecimalScalar)
  liquidityTokenTotalSupply: Decimal;

  @Field((type) => DecimalScalar)
  liquidityTokenBalance: Decimal;

  constructor(position: LiquidityPositionSnapshot) {
    this._id = position._id;
    this.id = position.id;
    this.liquidityPosition = new Position(position.liquidityPosition);
    this.timestamp = position.timestamp;
    this.blockNumber = position.blockNumber;
    this.user = new User(position.user);
    this.pair = new Pair(position.pair);
    this.token0PriceUSD = position.token0PriceUSD;
    this.token1PriceUSD = position.token1PriceUSD;
    this.reserve0 = position.reserve0;
    this.reserve1 = position.reserve1;
    this.reserveUSD = position.reserveUSD;
    this.liquidityTokenTotalSupply = position.liquidityTokenTotalSupply;
    this.liquidityTokenBalance = position.liquidityTokenBalance;
  }
}

export const LiquidityPositionSnapshotModel = getModelForClass(
  LiquidityPositionSnapshotDb
);
