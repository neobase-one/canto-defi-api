import { getModelForClass, Prop as Property } from "@typegoose/typegoose";
import { ObjectId } from "mongodb";
import { ObjectType, Field, ID, Float, Int } from "type-graphql";
import { DecimalScalar } from "../types/decimalScalar";
import Decimal from "decimal.js";
import { ObjectIdScalar } from "../types/objectIdScalar";
import { ZERO_BD } from "../utils/constants";

@ObjectType()
export class Token {
  @Field((type) => ObjectIdScalar)
  @Property({ default: "", required: false })
  readonly _id: ObjectId;

  @Field((type) => ID)
  @Property({ default: "", required: false })
  id: string;

  @Field((type) => String)
  @Property({ default: "", required: false })
  name: string;
  
  @Field((type) => String)
  @Property({ default: "", required: false })
  symbol: string;

  @Field((type) => Int)
  @Property({ default: new Decimal("0"), required: false })
  decimals: number;

  @Field((type) => DecimalScalar)
  @Property({ default: new Decimal("0"), required: false })
  totalSupply: Decimal;

  @Field((type) => DecimalScalar)
  @Property({ default: new Decimal("0"), required: false })
  tradeVolume: Decimal;

  @Field((type) => DecimalScalar)
  @Property({ default: new Decimal("0"), required: false })
  tradeVolumeUSD: Decimal;

  @Field((type) => DecimalScalar)
  @Property({ default: new Decimal("0"), required: false })
  untrackedVolumeUSD: Decimal;

  @Field((type) => DecimalScalar)
  @Property({ default: new Decimal("0"), required: false })
  txCount: Decimal;

  @Field((type) => DecimalScalar)
  @Property({ default: new Decimal("0"), required: false })
  totalLiquididty: Decimal;

  @Field((type) => DecimalScalar)
  @Property({ default: new Decimal("0"), required: false })
  derivedETH: Decimal;

  constructor (address: string) {
    this._id = new ObjectId();
    this.id = address;
    this.name = "";
    this.symbol = "";
    this.decimals = 0;
    this.totalSupply = ZERO_BD;
    this.tradeVolume = ZERO_BD;
    this.tradeVolumeUSD = ZERO_BD;
    this.untrackedVolumeUSD = ZERO_BD;
    this.txCount = ZERO_BD;
    this.totalLiquididty = ZERO_BD;
    this.derivedETH = ZERO_BD;
  }
}

export const TokenModel = getModelForClass(Token);
