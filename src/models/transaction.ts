import { getModelForClass, Prop as Property } from "@typegoose/typegoose";
import { ObjectId } from "mongodb";
import { ObjectType, Field, ID, Float, Int } from "type-graphql";
import { DecimalScalar } from "../types/decimalScalar";
import Decimal from "decimal.js";
import { Mint } from "./mint";
import { Burn } from "./burn";
import { Swap } from "./swap";
import { ObjectIdScalar } from "../types/objectIdScalar";
import { ZERO_BD } from "../utils/constants";

@ObjectType()
export class Transaction {
  @Field((type) => ObjectIdScalar)
  @Property({ default: "", required: false })
  readonly _id: ObjectId;

  @Field((type) => ID)
  @Property({ default: "", required: false })
  id: string;

  @Field((type) => DecimalScalar)
  @Property({ default: new Decimal("0"), required: false })
  timestamp: Decimal;

  @Field((type) => DecimalScalar)
  @Property({ default: new Decimal("0"), required: false })
  blockNumber: Decimal;

  @Field((type) => [Mint])
  @Property({ default: [], required: false, type: () => Mint })
  mints: string[]; // todo: how to return Mint object

  @Field((type) => [Burn])
  @Property({ default: [], required: false, type: () => Burn })
  burns: string[];

  @Field((type) => [Swap])
  @Property({ default: [], required: false, type: () => Swap })
  swaps: string[];

  constructor (hash: string) {
    this._id = new ObjectId();
    this.id = hash;
    this.timestamp = ZERO_BD;
    this.blockNumber = ZERO_BD;
    this.mints = [];
    this.burns = [];
    this.swaps = [];
  }
}

export const TransactionModel = getModelForClass(Transaction);
