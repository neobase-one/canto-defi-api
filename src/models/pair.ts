import { getModelForClass, Prop as Property } from "@typegoose/typegoose";
import { ObjectId } from "mongodb";
import { ObjectType, Field, ID, Float, Int } from "type-graphql";
import { DecimalScalar } from "../types/decimalScalar";
import Decimal from "decimal.js";
import { Token } from "./token";
import { Ref } from "../types/ref";
import { ObjectIdScalar } from "../types/objectIdScalar";
import { EMPTY_TOKEN, ZERO_BD } from "../utils/constants";

// mongo database object
export class PairDb {
  @Property({ default: "", required: false })
  readonly _id: ObjectId;

  @Property({ default: "", required: false })
  id: string;

  @Property({ ref: () => Token, required: false })
  token0?: Ref<Token>;

  @Property({ ref:()=> Token, required: false })
  token1?: Ref<Token>;

  @Property({ default: new Decimal("0"), required: false })
  reserve0: Decimal;

  @Property({ default: new Decimal("0"), required: false })
  reserve1: Decimal;

  @Property({ default: new Decimal("0"), required: false })
  totalSupply: Decimal;

  @Property({ default: new Decimal("0"), required: false })
  reserveETH: Decimal;

  @Property({ default: new Decimal("0"), required: false })
  reserveUSD: Decimal;

  @Property({ default: new Decimal("0"), required: false })
  trackedReserveETH: Decimal;

  @Property({ default: new Decimal("0"), required: false })
  token0Price: Decimal;

  @Property({ default: new Decimal("0"), required: false })
  token1Price: Decimal;

  @Property({ default: new Decimal("0"), required: false })
  volumeToken0: Decimal;

  @Property({ default: new Decimal("0"), required: false })
  volumeToken1: Decimal;

  @Property({ default: new Decimal("0"), required: false })
  volumeUSD: Decimal;

  @Property({ default: new Decimal("0"), required: false })
  untrackedVolumeUSD: Decimal;

  @Property({ default: new Decimal("0"), required: false })
  txCount: Decimal;

  @Property({ default: new Decimal("0"), required: false })
  createdAtTimestamp: Decimal;

  @Property({ default: new Decimal("0"), required: false })
  createdAtBlockNumber: Decimal;

  @Property({ default: new Decimal("0"), required: false })
  liquidityProviderCount: Decimal;

  constructor(address: string) {
    this._id = new ObjectId();
    this.id = address;
    this.token0 = EMPTY_TOKEN;
    this.token1 = EMPTY_TOKEN;
    this.reserve0 = ZERO_BD;
    this.reserve1 = ZERO_BD;
    this.totalSupply = ZERO_BD;
    this.reserveETH = ZERO_BD;
    this.reserveUSD = ZERO_BD;
    this.trackedReserveETH = ZERO_BD;
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

  toGenerated() {
    return new Block(this)
  }
}

// graphql return object (type Block as shown in schema.ts)
@ObjectType()
export class Pair {
  @Field((type) => ObjectIdScalar)
  _id: ObjectId;

  @Field((type) => ID)
  id: string;

  @Field((type) => Token)
  token0: Token;

  @Field((type) => Token)
  token1: Token;

  @Field((type) => DecimalScalar)
  reserve0: Decimal;

  @Field((type) => DecimalScalar)
  reserve1: Decimal;

  @Field((type) => DecimalScalar)
  totalSupply: Decimal;

  @Field((type) => DecimalScalar)
  reserveETH: Decimal;

  @Field((type) => DecimalScalar)
  reserveUSD: Decimal;

  @Field((type) => DecimalScalar)
  trackedReserveETH: Decimal;

  @Field((type) => DecimalScalar)
  token0Price: Decimal;

  @Field((type) => DecimalScalar)
  token1Price: Decimal;

  @Field((type) => DecimalScalar)
  volumeToken0: Decimal;

  @Field((type) => DecimalScalar)
  volumeToken1: Decimal;

  @Field((type) => DecimalScalar)
  volumeUSD: Decimal;

  @Field((type) => DecimalScalar)
  untrackedVolumeUSD: Decimal;

  @Field((type) => DecimalScalar)
  txCount: Decimal;

  @Field((type) => DecimalScalar)
  createdAtTimestamp: Decimal;

  @Field((type) => DecimalScalar)
  createdAtBlockNumber: Decimal;

  @Field((type) => DecimalScalar)
  liquidityProviderCount: Decimal;

  constructor(pair: PairDb) {
    this._id = pair._id;
    this.id = pair.id;
    this.token0 = new Token(pair.token0);
    this.token1 = new Token(pair.token1);
    this.reserve0 = pair.reserve0;
    this.reserve1 = pari.reserve1;
    this.totalSupply = pair.totalSupply;
    this.reserveETH = pair.reserveETH;
    this.reserveUSD = pair.reserveUSD;
    this.trackedReserveETH = pair.trackedReserveETH;
    this.token0Price = pair.token0Price;
    this.token1Price = pair.token1Price;
    this.volumeToken0 = pair.volumeToken0;
    this.volumeToken1 = pair.volueToken1;
    this.volumeUSD = pair.volumeUSD;
    this.untrackedVolumeUSD = pair.untrackedVolumeUSD;
    this.txCount = pair.txCount;
    this.createdAtTimestamp = pair.createdAtTimestamp;
    this.createdAtBlockNumber = pair.createdAtBlockNumber;
    this.liquidityProviderCount = pair.liquidityProviderCount;
  }
}

export const PairModel = getModelForClass(PairDb);
