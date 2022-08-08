import { getModelForClass, Prop as Property } from "@typegoose/typegoose";
import { ObjectId } from "mongodb";
import { Field, ObjectType, ID, Int } from "type-graphql";
import Decimal from "decimal.js";
import { ObjectIdScalar } from "../types/objectIdScalar";

// mongo database object
export class Block {
  readonly _id: ObjectId;

  // decorator docs: https://typegoose.github.io/typegoose/docs/api/decorators/prop
  @Property({ default: "", required: false })
  id: string;

  @Property({ name: "number", default: 0, required: false })
  number: number;

  constructor (id: string) {
    this._id = new ObjectId();
    this.id = id;
    this.number = 0;
  }
}

export const BlockModel = getModelForClass(Block);

// graphql return object (type Block as shown in schema.ts)
// decorator docs: https://typegraphql.com/docs/types-and-fields.html 
@ObjectType()
export class BlockType {
  @Field((type) => ObjectIdScalar)
  _id: ObjectId;

  @Field((type) => ID)
  id: string;

  @Field((type) => Int)
  number: number;

  // function to convert database object class into the return object
  // as defined in graphql schema
  // create blockType from block
  toGenerated(block: Block) {
    this._id = block._id;
    this.id = block.id;
    this.number = block.number;
  }
}
