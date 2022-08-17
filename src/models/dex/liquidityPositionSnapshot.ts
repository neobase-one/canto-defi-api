import { getModelForClass, Prop as Property } from "@typegoose/typegoose";
import Decimal from "decimal.js";
import { ObjectId } from "mongodb";
import { Field, ID, ObjectType } from "type-graphql";
import { DecimalScalar } from "../../types/decimalScalar";
import { ObjectIdScalar } from "../../types/objectIdScalar";
import { ZERO_BD } from "../../utils/constants";
import { LiquidityPosition } from "./liquidityPosition";
import { Pair } from "./pair";
import { User } from "./user";

// mongo database object
export class LiquidityPositionSnapshotDb {
  @Property({ default: "", required: false })
  readonly _id: ObjectId;

  @Property({ default: "", required: false })
  id: string;

  @Property({ default: "", required: false })
  liquidityPosition: string; // todo ref

  @Property({ default: new Decimal("0"), required: false })
  timestamp: Decimal;

  @Property({ default: new Decimal("0"), required: false })
  blockNumber: Decimal;

  @Property({ default: "", required: false })
  user: string; // todo ref

  @Property({ default: "", required: false })
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
    this.liquidityPosition = "";
    this.timestamp = ZERO_BD;
    this.blockNumber = ZERO_BD;
    this.user = "";
    this.pair = "";
    this.token0PriceUSD = ZERO_BD;
    this.token1PriceUSD = ZERO_BD;
    this.reserve0 = ZERO_BD;
    this.reserve1 = ZERO_BD;
    this.reserveUSD = ZERO_BD;
    this.liquidityTokenTotalSupply = ZERO_BD;
    this.liquidityTokenBalance = ZERO_BD;
  }

  toGenerated() {
    var l = new LiquidityPositionSnapshot()
    return l.fromDb(this);
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

  constructor() {
    this._id = new ObjectId();
    this.id = "";
    this.liquidityPosition = new LiquidityPosition();
    this.timestamp = ZERO_BD;
    this.blockNumber = ZERO_BD;
    this.user = new User();
    this.pair = new Pair();
    this.token0PriceUSD = ZERO_BD;
    this.token1PriceUSD = ZERO_BD;
    this.reserve0 = ZERO_BD;
    this.reserve1 = ZERO_BD;
    this.reserveUSD = ZERO_BD;
    this.liquidityTokenTotalSupply = ZERO_BD;
    this.liquidityTokenBalance = ZERO_BD;
  }

  fromDb(position: LiquidityPositionSnapshotDb) {
    this._id = position._id;
    this.id = position.id;
    var l = new LiquidityPosition();
    l.justId(position.liquidityPosition);
    this.liquidityPosition = l;
    this.timestamp = position.timestamp;
    this.blockNumber = position.blockNumber;
    var u = new User();
    u.justId(position.user);
    this.user = u;
    var p = new Pair();
    p.justId(position.pair);
    this.pair = p;
    this.token0PriceUSD = position.token0PriceUSD;
    this.token1PriceUSD = position.token1PriceUSD;
    this.reserve0 = position.reserve0;
    this.reserve1 = position.reserve1;
    this.reserveUSD = position.reserveUSD;
    this.liquidityTokenTotalSupply = position.liquidityTokenTotalSupply;
    this.liquidityTokenBalance = position.liquidityTokenBalance;
    return this;
  }

  justId(id: string) {
    this.id = id;
  }
}

export const LiquidityPositionSnapshotModel = getModelForClass(
  LiquidityPositionSnapshotDb
);
