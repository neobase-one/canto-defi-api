import { getModelForClass, Prop as Property } from "@typegoose/typegoose";
import { ObjectId } from "mongodb";
import { ObjectType, Field, ID, Float, Int } from "type-graphql";
import { DecimalScalar } from "../types/decimalScalar";
import Decimal from "decimal.js";
import { Mint } from "./mint";
import { Burn } from "./burn";
import { Swap } from "./swap";
import { ObjectIdScalar } from "../types/objectIdScalar";
import { ZERO_BD } from "../utils/constants";

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

  @Property({ default: [], required: false})
  mints: string[]; // todo: how to return Mint object

  @Property({ default: [], required: false})
  burns: string[];

  @Property({ default: [], required: false})
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

  toGenerated() {
    return new Transaction(this);
  }
}

export const BlockModel = getModelForClass(TransactionDb);

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
  mints: Mint[]; // todo: how to return Mint object

  @Field((type) => [Burn])
  burns: Burn[];

  @Field((type) => [Swap])
  swaps: string[];



  constructor(txn: TransactionDb) {
    this._id = txn._id;
    // todo: fill rest
    let mintTypes = [];
    for(let mintId of txn.mints) {
      mintTypes.push(new Mint(mintId));
    }
    this.mints = mintTypes; // todo: same for swaps, burn
  }

  // function to convert database object class into the return object
  // as defined in graphql schema
  // create blockType from block
  // toGenerated(transactiondb: TransactionDb) {
  //   this._id = transactiondb._id;
  //   this.id = transactiondb.id;
  //   this.timestamp = transactiondb.timestamp;
  //   this.blockNumber = transactiondb.blockNumber;
  //   this.mints = transactiondb.mints;
  //   this.burns = transactiondb.burns;
  //   this.swaps = transactiondb.swaps;
  // }
}