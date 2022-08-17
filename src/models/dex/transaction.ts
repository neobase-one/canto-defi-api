import { getModelForClass, Prop as Property } from "@typegoose/typegoose";
import Decimal from "decimal.js";
import { ObjectId } from "mongodb";
import { Field, ID, ObjectType } from "type-graphql";
import { DecimalScalar } from "../../types/decimalScalar";
import { ObjectIdScalar } from "../../types/objectIdScalar";
import { ZERO_BD } from "../../utils/constants";
import { Burn } from "./burn";
import { Mint } from "./mint";
import { Swap } from "./swap";

// mongo database object
export class TransactionDb {
  readonly _id: ObjectId;

  // decorator docs: https://typegoose.github.io/typegoose/docs/api/decorators/prop
  @Property({ default: "", required: false })
  id: string;

  @Property({ default: new Decimal("0"), required: false })
  timestamp: Decimal;

  @Property({ default: new Decimal("0"), required: false })
  blockNumber: Decimal;

  @Property({ type: String, default: [], required: false })
  mints: string[];

  @Property({ type: String, default: [], required: false })
  burns: string[];

  @Property({ type: String, default: [], required: false })
  swaps: string[];

  constructor(id: string) {
    this._id = new ObjectId();
    this.id = id;
    this.timestamp = ZERO_BD;
    this.blockNumber = ZERO_BD;
    this.mints = [];
    this.burns = [];
    this.swaps = [];
  }

  async toGenerated() {
    var t = new Transaction()
    return await (t.fromDb(this));
  }
}

export const TransactionModel = getModelForClass(TransactionDb);

// graphql return object (type Block as shown in schema.ts)
// decorator docs: https://typegraphql.com/docs/types-and-fields.html 
@ObjectType()
export class Transaction {
  @Field((type) => ObjectIdScalar)
  _id: ObjectId;

  @Field((type) => ID)
  id: string;

  @Field((type) => DecimalScalar)
  timestamp: Decimal;

  @Field((type) => DecimalScalar)
  blockNumber: Decimal;

  @Field((type) => [Mint])
  mints: Mint[];

  @Field((type) => [Burn])
  burns: Burn[];

  @Field((type) => [Swap])
  swaps: Swap[];

  constructor() {
    this._id = new ObjectId();
    this.id = "";
    this.timestamp = ZERO_BD;
    this.blockNumber = ZERO_BD;
  }

  async fromDb(txn: TransactionDb) {
    this._id = txn._id;
    this.id = txn.id;
    this.timestamp = txn.timestamp;
    this.blockNumber = txn.blockNumber;
    return this;
  }

  justId(id: string) {
    this.id = id;
  }
}