import { getModelForClass, Prop as Property } from "@typegoose/typegoose";
import { ObjectId } from "mongodb";
import { ObjectType, Field, ID, Float, Int } from "type-graphql";
import { DecimalScalar } from "../../types/decimalScalar";
import Decimal from "decimal.js";
import { Mint, MintModel } from "./mint";
import { Burn, BurnModel } from "./burn";
import { Swap, SwapModel } from "./swap";
import { ObjectIdScalar } from "../../types/objectIdScalar";
import { ZERO_BD } from "../../utils/constants";

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
    return await(t.fromDb(this));
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
  mints: Mint[]; // todo: how to return Mint object

  @Field((type) => [Burn])
  burns: Burn[];

  @Field((type) => [Swap])
  swaps: Swap[];

  constructor() {
    this._id = new ObjectId();
    this.id = "";
    this.timestamp = ZERO_BD;
    this.blockNumber = ZERO_BD;
    this.mints = [];
    this.burns = [];
    this.swaps = [];
  }

  async fromDb(txn: TransactionDb) {
    this._id = txn._id;
    this.id = txn.id;
    this.timestamp = txn.timestamp;
    this.blockNumber = txn.blockNumber;

    let mintTypes = [];
    for (let mintId of txn.mints) {
      var m = await this.getMint(mintId);
      mintTypes.push(m);
    }
    this.mints = mintTypes;

    let burnTypes = [];
    for (let burnId of txn.burns) {
      var b = await this.getBurn(burnId);
      burnTypes.push(b);
    }
    this.burns = burnTypes;

    let swapTypes = [];
    for (let swapId of txn.swaps) {
      var s = await this.getSwap(swapId);
      swapTypes.push(s);
    }
    this.swaps = swapTypes;

    return this;
  }

  justId(id: string) {
    this.id = id;
  }

  async getMint(id:string):Promise<Mint>{
    const mintList = await MintModel.find({id:id});
    return mintList[0].toGenerated();
  }

  async getSwap(id:string):Promise<Swap>{
    const swapList = await SwapModel.find({id:id});
    return swapList[0].toGenerated();
  }

  async getBurn(id:string):Promise<Burn>{
    const burnList = await BurnModel.find({id:id});
    return burnList[0].toGenerated();
  }
}