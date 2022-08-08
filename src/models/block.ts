import { getModelForClass, Prop as Property } from "@typegoose/typegoose";
import { ObjectId } from "mongodb";
import { Field, ObjectType, ID, Int } from "type-graphql";
import Decimal from "decimal.js";
import { ObjectIdScalar } from "../types/objectIdScalar";

@ObjectType()
export class Block {
  @Field((type) => ObjectIdScalar)
  readonly _id: ObjectId;

  @Field((type) => ID)
  @Property({ default: "", required: false })
  id: string;

  @Field((type) => Int)
  @Property({ name: "number", default: 0, required: false })
  number: number;

  constructor (id: string) {
    this._id = new ObjectId();
    this.id = id;
    this.number = 0;
  }
}

export const BlockModel = getModelForClass(Block);
