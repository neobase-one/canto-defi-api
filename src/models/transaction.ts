import { getModelForClass, Prop as Property } from "@typegoose/typegoose";
import { ObjectId } from "mongodb";
import { ObjectType, Field, ID, Float, Int } from "type-graphql";
import { DecimalScalar } from "../types/decimalScalar";
import Decimal from "decimal.js";
import { Mint } from "./mint";
import { Burn } from "./burn";
import { Swap } from "./swap";
import { ObjectIdScalar } from "../types/objectIdScalar";

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
  mints: Mint[];

  @Field((type) => [Burn])
  @Property({ default: [], required: false, type: () => Burn })
  burns: Burn[];

  @Field((type) => [Swap])
  @Property({ default: [], required: false, type: () => Swap })
  swaps: Swap[];
}

export const TransactionModel = getModelForClass(Transaction);
