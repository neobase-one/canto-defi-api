import { getModelForClass, Prop as Property } from "@typegoose/typegoose";
import { ObjectId } from "mongodb";
import { Field, ObjectType, ID } from "type-graphql";
import { DecimalScalar } from "../types/decimalScalar";
import Decimal from "decimal.js";
import { ZERO_BD } from "../utils/constants";
import { ObjectIdScalar } from "../types/objectIdScalar";

@ObjectType()
export class Bundle {
  @Field((type) => ObjectIdScalar)
  readonly _id: ObjectId;

  @Field((type) => ID)
  @Property({ default: "", required: false })
  id: string;

  @Field((type) => DecimalScalar)
  @Property({ name: "ethPrice", default: new Decimal("0"), required: false })
  ethPrice: Decimal;

  constructor (id: string) {
    this._id = new ObjectId();
    this.id = id;
    this.ethPrice = ZERO_BD;
  }
}

export const BundleModel = getModelForClass(Bundle);
