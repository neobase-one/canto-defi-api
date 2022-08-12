import { getModelForClass, Prop, Prop as Property } from "@typegoose/typegoose";
import { ObjectId } from "mongodb";
import { Field, ObjectType, ID, Int } from "type-graphql";
import Decimal from "decimal.js";
import { ObjectIdScalar } from "../../types/objectIdScalar";


// mongo database object
export class BlockDb {

  readonly _id: ObjectId;

  @Property({ default: "", required: false })
  id: string;

  @Property({ name: "number", default: 0, required: false })
  number: number;

  @Property({default: 0, required: false})
  timestamp: number

  constructor (id: string) {
    this._id = new ObjectId();
    this.id = id;
    this.number = 0;
    this.timestamp = 0;
  }

  toGenerated() {
    return new Block(this)
  }
}


export const BlockModel = getModelForClass(BlockDb);

// graphql return object (type Block as shown in schema.ts)
// decorator docs: https://typegraphql.com/docs/types-and-fields.html 
@ObjectType()
export class Block {
  @Field((type) => ObjectIdScalar)
  _id: ObjectId;

  @Field((type) => ID)
  id: string;

  @Field((type) => Int)
  number: number;

  @Field((type) => Int)
  timestamp: number;

  // function to convert database object class into the return object
  // as defined in graphql schema
  // create blockType from block
  constructor(block: BlockDb) {
    this._id = block._id;
    this.id = block.id;
    this.number = block.number;
    this.timestamp = block.timestamp;
  }
}

