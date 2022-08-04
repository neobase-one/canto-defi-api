import { getModelForClass, Prop as Property } from "@typegoose/typegoose";
import { ObjectId } from "mongodb";
import { Field, ObjectType, ID } from "type-graphql";
import { DecimalScalar } from "../types/decimalScalar";
import Decimal from "decimal.js";
import { LiquidityPosition } from "./liquidityPosition";
import { Ref } from "../types/ref";

@ObjectType()
export class User {
  @Field()
  readonly _id: ObjectId;

  @Field((type) => ID)
  @Property({ default: "", required: true })
  id: string;

  @Field((type) => LiquidityPosition)
  @Property({ ref: LiquidityPosition, required: true })
  liquidityPosition: Ref<LiquidityPosition>;

  @Field((type) => DecimalScalar)
  @Property({ default: new Decimal("0"), required: true })
  usdSwapped: Decimal; // todo: change to canto
}

export const UserModel = getModelForClass(User);
