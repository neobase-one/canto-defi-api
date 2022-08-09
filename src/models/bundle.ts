import { getModelForClass, Prop as Property } from "@typegoose/typegoose";
import { ObjectId } from "mongodb";
import { Field, ObjectType, ID } from "type-graphql";
import { DecimalScalar } from "../types/decimalScalar";
import Decimal from "decimal.js";
import { ZERO_BD } from "../utils/constants";
import { ObjectIdScalar } from "../types/objectIdScalar";

// mongo database object
export class BundleDb {
  readonly _id: ObjectId;

  // decorator docs: https://typegoose.github.io/typegoose/docs/api/decorators/prop
  @Property({ default: "", required: false })
  id: string;

  @Property({ name: "ethPrice", default: new Decimal("0"), required: false })
  ethPrice: Decimal;

  constructor (id: string) {
    this._id = new ObjectId();
    this.id = id;
    this.ethPrice = ZERO_BD;
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
  ethPrice: Decimal;

  constructor() {
    this._id = new ObjectId();
    this.id = "";
    this.ethPrice = ZERO_BD;
  }

  fromDb(bundle: BundleDb) {
    this._id = bundle._id;
    this.id = bundle.id;
    this.ethPrice = bundle.ethPrice;
  }

  justId(id:string) {
    this.id=id;
  }
}

export const BundleModel = getModelForClass(BundleDb);
