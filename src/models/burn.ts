import { getModelForClass, Prop as Property } from "@typegoose/typegoose";
import { ObjectId } from "mongodb";
import { ObjectType, Field, ID, Float, Int } from "type-graphql";
import { DecimalScalar } from "../types/decimalScalar";
import Decimal from "decimal.js";
import { Transaction } from "./transaction";
import {Ref} from '../types/ref';
import { Pair } from "./pair";
import { ObjectIdScalar } from "../types/objectIdScalar";
import { ZERO_BD } from "../utils/constants";

// mongo database object
export class BurnDb {
  readonly _id: ObjectId;

  @Property({ default: "", required: false })
  id: string;

  @Property({ref: Transaction, required: false})
  transaction: string; // todo: Ref

  @Property({ default: new Decimal("0"), required: false })
  timestamp: Decimal;

  @Property({ default: "", required: false})
  pair: string; // todo: Ref

  @Property({ default: new Decimal("0"), required: false })
  liquidity: Decimal;

  @Property({ default: new Decimal("0"), required: false })
  amount0: Decimal;

  @Property({ default: new Decimal("0"), required: false })
  amount1: Decimal;

  @Property({ default: new Decimal("0"), required: false })
  logIndex: Decimal;

  @Property({ default: new Decimal("0"), required: false })
  amountUSD: Decimal;

  @Property({ default: new Decimal("0"), required: false })
  feeLiquidity: Decimal;

  @Property({ default: false, required: false })
  needsComplete: Boolean;

  // todo: to, sender, feeTo - Bytes
  @Property({ default: "", required: false })
  to: string;

  @Property({ default: "", required: false })
  sender: string;

  @Property({ default: "", required: false })
  feeTo: string;

  constructor (id: string) {
    this._id = new ObjectId();
    this.id = id;
    this.transaction = "";
    this.timestamp = ZERO_BD;
    this.pair = "";
    this.liquidity = ZERO_BD;
    this.amount0 = ZERO_BD;
    this.amount1 = ZERO_BD;
    this.logIndex = ZERO_BD;
    this.amountUSD = ZERO_BD;
    this.feeLiquidity = ZERO_BD;
    this.needsComplete = false; // todo: init value?
    this.sender = "";
    this.to = "";
    this.feeTo = "";
  }

  toGenerated() {
    var b = new Burn()
    return b.fromDb(this);
  }
}

// graphql return object (type Block as shown in schema.ts)
// decorator docs: https://typegraphql.com/docs/types-and-fields.html 
@ObjectType()
export class Burn {
  @Field((type) => ObjectIdScalar)
  _id: ObjectId;

  @Field((type) => ID)
  id: string;

  @Field((type) => Transaction)
  transaction: string; // todo: Ref

  @Field((type) => DecimalScalar)
  timestamp: Decimal;

  @Field((type) => Pair)
  pair: Pair; // todo: Ref

  @Field((type) => DecimalScalar)
  liquidity: Decimal;

  @Field((type) => DecimalScalar)
  amount0: Decimal;

  @Field((type) => DecimalScalar)
  amount1: Decimal;

  @Field((type) => DecimalScalar)
  logIndex: Decimal;

  @Field((type) => DecimalScalar)
  amountUSD: Decimal;

  @Field((type) => DecimalScalar)
  feeLiquidity: Decimal;

  @Field((type) => Boolean)
  needsComplete: Boolean;

  // todo: to, sender, feeTo - Bytes
  @Field((type) => String)
  to: string;

  @Field((type) => String)
  sender: string;

  @Field((type) => String)
  feeTo: string;

  constructor() {
    this._id = new ObjectId();
    this.id = "";
    this.transaction = "";
    this.timestamp = ZERO_BD;
    this.pair = new Pair();
    this.liquidity = ZERO_BD;
    this.amount0 = ZERO_BD;
    this.amount1 = ZERO_BD;
    this.logIndex = ZERO_BD;
    this.amountUSD = ZERO_BD;
    this.feeLiquidity = ZERO_BD;
    this.needsComplete = false; // todo: init value?
    this.sender = "";
    this.to = "";
    this.feeTo = "";
  }
  
  fromDb(burn: BurnDb) {
    this._id = burn._id;
    this.id = burn.id;
    this.transaction = burn.transaction;
    this.timestamp = burn.timestamp;
    var p = new Pair();
    p.justId(burn.pair);
    this.pair = p;
    this.liquidity = burn.liquidity;
    this.amount0 = burn.amount0;
    this.amount1 = burn.amount1;
    this.logIndex = burn.logIndex;
    this.amountUSD = burn.amountUSD;
    this.feeLiquidity = burn.feeLiquidity;
    this.needsComplete = burn.needsComplete; // todo: init value?
    this.sender = burn.sender;
    this.to = burn.to;
    this.feeTo = burn.feeTo;
  }

  justId(id: string) {
    this.id = id;
  }
}

export const BurnModel = getModelForClass(BurnDb);
