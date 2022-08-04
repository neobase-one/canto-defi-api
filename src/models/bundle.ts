import { getModelForClass, Prop as Property } from "@typegoose/typegoose";
import { ObjectId } from "mongodb";
import { Field, ObjectType, ID } from "type-graphql";
import { DecimalScalar } from "../types/decimalScalar";
import Decimal from "decimal.js";

@ObjectType()
export class Bundle {
  @Field()
  readonly _id: ObjectId;

  @Field((type) => ID)
  @Property({ default: "", required: true })
  id: string;

  @Field((type) => DecimalScalar)
  @Property({ default: new Decimal("0"), required: true })
  cantoPrice: Decimal;
}

export const BundleModel = getModelForClass(Bundle);
