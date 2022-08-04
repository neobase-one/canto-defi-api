import { getModelForClass, Prop as Property } from "@typegoose/typegoose";
import { ObjectId } from "mongoose";
import { ObjectType, Field, ID, Float, Int } from "type-graphql";
import { DecimalScalar } from "../types/decimalScalar";
import Decimal from "decimal.js";
import { Mint } from "./mint";
import { Burn } from "./burn";
import { Swap } from "./swap";

@ObjectType()
export class Transaction {
  @Field()
  @Property({ default: "", required: true })
  readonly _id: ObjectId;

  @Field((type) => ID)
  @Property({ default: "", required: true })
  id: string;

  @Field((type) => DecimalScalar)
  @Property({ default: new Decimal("0"), required: true })
  timestamp: Decimal;

  @Field((type) => DecimalScalar)
  @Property({ default: new Decimal("0"), required: true })
  blockNumber: Decimal;

  @Field((type) => [Mint])
  @Property({ default: [], required: true, type: () => Mint })
  mints: Mint[];

  @Field((type) => [Burn])
  @Property({ default: [], required: true, type: () => Burn })
  burns: Burn[];

  @Field((type) => [Swap])
  @Property({ default: [], required: true, type: () => Swap })
  swaps: Swap[];
}

export const TransactionModel = getModelForClass(Transaction);
