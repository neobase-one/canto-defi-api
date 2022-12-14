import { getModelForClass, Prop as Property } from "@typegoose/typegoose";
import Decimal from "decimal.js";
import { ObjectId } from "mongodb";
import { Field, ID, ObjectType } from "type-graphql";
import { DecimalScalar } from "../../types/decimalScalar";
import { ObjectIdScalar } from "../../types/objectIdScalar";
import { ZERO_BD } from "../../utils/constants";

// mongo database object
export class BundleDb {
  readonly _id: ObjectId;

  // decorator docs: https://typegoose.github.io/typegoose/docs/api/decorators/prop
  @Property({ default: "", required: false })
  id: string;

  @Property({ default: new Decimal("0"), required: false })
  notePrice: Decimal;

  constructor(id: string) {
    this._id = new ObjectId();
    this.id = id;
    this.notePrice = ZERO_BD;
  }

  toGenerated() {
    var b = new Bundle()
    return b.fromDb(this);
  }
}

// graphql return object (type Block as shown in schema.ts)
// decorator docs: https://typegraphql.com/docs/types-and-fields.html 
@ObjectType()
export class Bundle {
  @Field((type) => ObjectIdScalar)
  _id: ObjectId;

  @Field((type) => ID)
  id: string;

  @Field((type) => DecimalScalar)
  notePrice: Decimal;

  constructor() {
    this._id = new ObjectId();
    this.id = "";
    this.notePrice = ZERO_BD;
  }

  fromDb(bundle: BundleDb) {
    this._id = bundle._id;
    this.id = bundle.id;
    this.notePrice = bundle.notePrice;
    return this;
  }

  justId(id: string) {
    this.id = id;
  }
}

export const BundleModel = getModelForClass(BundleDb);
