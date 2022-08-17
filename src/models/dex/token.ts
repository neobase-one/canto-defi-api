import { getModelForClass, Prop as Property } from "@typegoose/typegoose";
import Decimal from "decimal.js";
import { ObjectId } from "mongodb";
import { Field, ID, Int, ObjectType } from "type-graphql";
import { DecimalScalar } from "../../types/decimalScalar";
import { ObjectIdScalar } from "../../types/objectIdScalar";
import { ZERO_BD } from "../../utils/constants";

export class TokenDb {
  readonly _id: ObjectId;

  @Property({ default: "", required: false })
  id: string;

  @Property({ default: "", required: false })
  name: string;

  @Property({ default: "", required: false })
  symbol: string;

  @Property({ default: new Decimal("0"), required: false })
  decimals: number;

  @Property({ default: new Decimal("0"), required: false })
  totalSupply: Decimal;

  @Property({ default: new Decimal("0"), required: false })
  tradeVolume: Decimal;

  @Property({ default: new Decimal("0"), required: false })
  tradeVolumeUSD: Decimal;

  @Property({ default: new Decimal("0"), required: false })
  untrackedVolumeUSD: Decimal;

  @Property({ default: new Decimal("0"), required: false })
  txCount: Decimal;

  @Property({ default: new Decimal("0"), required: false })
  totalLiquidity: Decimal;

  @Property({ default: new Decimal("0"), required: false })
  derivedCANTO: Decimal;

  constructor(id: string) {
    this._id = new ObjectId();
    this.id = id;
    this.name = "";
    this.symbol = "";
    this.decimals = 0;
    this.totalSupply = ZERO_BD;
    this.tradeVolume = ZERO_BD;
    this.tradeVolumeUSD = ZERO_BD;
    this.untrackedVolumeUSD = ZERO_BD;
    this.txCount = ZERO_BD;
    this.totalLiquidity = ZERO_BD;
    this.derivedCANTO = ZERO_BD;
  }

  toGenerated() {
    var tkn = new Token();
    return tkn.fromDb(this);
  }
}

export const TokenModel = getModelForClass(TokenDb);

// graphql return object (type Block as shown in schema.ts)
// decorator docs: https://typegraphql.com/docs/types-and-fields.html 
@ObjectType()
export class Token {
  @Field((type) => ObjectIdScalar, { nullable: true })
  _id: ObjectId;

  @Field((type) => ID)
  id: string;

  @Field((type) => String, { nullable: true })
  name: string;

  @Field((type) => String, { nullable: true })
  symbol: string;

  @Field((type) => Int, { nullable: true })
  decimals: number;

  @Field((type) => DecimalScalar, { nullable: true })
  totalSupply: Decimal;

  @Field((type) => DecimalScalar, { nullable: true })
  tradeVolume: Decimal;

  @Field((type) => DecimalScalar, { nullable: true })
  tradeVolumeUSD: Decimal;

  @Field((type) => DecimalScalar, { nullable: true })
  untrackedVolumeUSD: Decimal;

  @Field((type) => DecimalScalar, { nullable: true })
  txCount: Decimal;

  @Field((type) => DecimalScalar, { nullable: true })
  totalLiquidity: Decimal;

  @Field((type) => DecimalScalar, { nullable: true })
  derivedCANTO: Decimal;

  fromDb(token: TokenDb) {
    this._id = token._id;
    this.id = token.id;
    this.name = token.name;
    this.symbol = token.symbol;
    this.decimals = token.decimals;
    this.totalSupply = token.totalSupply;
    this.tradeVolume = token.tradeVolume;
    this.tradeVolumeUSD = token.tradeVolumeUSD;
    this.untrackedVolumeUSD = token.untrackedVolumeUSD;
    this.txCount = token.txCount;
    this.totalLiquidity = token.totalLiquidity;
    this.derivedCANTO = token.derivedCANTO;
    return this;
  }

  justId(id: string) {
    this.id = id;
  }

  constructor() {
    this._id = new ObjectId();
    this.id = "";
    this.name = "";
    this.symbol = "";
    this.decimals = 0;
    this.totalSupply = ZERO_BD;
    this.tradeVolume = ZERO_BD;
    this.tradeVolumeUSD = ZERO_BD;
    this.untrackedVolumeUSD = ZERO_BD;
    this.txCount = ZERO_BD;
    this.totalLiquidity = ZERO_BD;
    this.derivedCANTO = ZERO_BD;
  }
}
