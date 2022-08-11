import { getModelForClass, Prop as Property } from "@typegoose/typegoose";
import { ObjectId } from "mongodb";
import { ObjectType, Field, ID} from "type-graphql";
import { DecimalScalar } from "../types/decimalScalar";
import Decimal from "decimal.js";
import { Transaction } from "./transaction";
import { Pair, PairModel } from "./pair";
import { ObjectIdScalar } from "../types/objectIdScalar";
import { ZERO_BD } from "../utils/constants";

// mongo database object
export class MintDb {
  readonly _id: ObjectId;

  @Property({ default: "", required: false })
  id: string;

  @Property({ default: "", required: false })
  transaction: string;

  @Property({ default: new Decimal("0"), required: false })
  timestamp: Decimal;

  @Property({ default: "", required: false })
  pair: string;

  @Property({ default: new Decimal("0"), required: false })
  liquidity: Decimal;

  @Property({ default: new Decimal("0"), required: false })
  amount0: Decimal;

  @Property({ default: new Decimal("0"), required: false })
  amount1: Decimal;

  @Property({ default: new Decimal("0"), required: false })
  logIndex: Decimal;

  @Property({ default: new Decimal("0"), required: false })
  amountUSD: Decimal;

  @Property({ default: new Decimal("0"), required: false })
  feeLiquidity: Decimal;

  @Property({ default: "", required: false })
  to: string;

  @Property({ default: "", required: false })
  sender: string;

  @Property({ default: "", required: false })
  feeTo: string;

  constructor(id: string) {
    this._id = new ObjectId();
    this.id = id;
    this.transaction = "";
    this.timestamp = ZERO_BD;
    this.pair = "";
    this.liquidity = ZERO_BD;
    this.amount0 = ZERO_BD;
    this.amount1 = ZERO_BD;
    this.logIndex = ZERO_BD;
    this.amountUSD = ZERO_BD;
    this.feeLiquidity = ZERO_BD;
    this.sender = "";
    this.to = "";
    this.feeTo = "";
  }

  toGenerated() {
    var m = new Mint()
    return m.fromDb(this);
  }
}

export const MintModel = getModelForClass(MintDb);

// graphql return object (type Block as shown in schema.ts)
// decorator docs: https://typegraphql.com/docs/types-and-fields.html 
@ObjectType()
export class Mint {
  @Field((type) => ObjectIdScalar)
  _id: ObjectId;

  @Field((type) => ID)
  id: string;

  @Field((type) => Transaction)
  transaction: Transaction; // todo: Ref conversion

  @Field((type) => DecimalScalar)
  timestamp: Decimal;

  @Field((type) => Pair)
  pair: Pair; // todo: Ref conversion

  @Field((type) => DecimalScalar)
  liquidity: Decimal;

  @Field((type) => DecimalScalar)
  amount0: Decimal;

  @Field((type) => DecimalScalar)
  amount1: Decimal;

  @Field((type) => DecimalScalar)
  logIndex: Decimal;

  @Field((type) => DecimalScalar)
  amountUSD: Decimal;

  @Field((type) => DecimalScalar)
  feeLiquidity: Decimal;

  // todo: to, sender, feeTo - Bytes
  @Field((type) => String)
  to: string;

  @Field((type) => String)
  sender: string;

  @Field((type) => String)
  feeTo: string;

  constructor() {
    this._id = new ObjectId();
    this.id = "";
    this.transaction = new Transaction();
    this.timestamp = ZERO_BD;
    this.pair = new Pair();
    this.liquidity = ZERO_BD;
    this.amount0 = ZERO_BD;
    this.amount1 = ZERO_BD;
    this.logIndex = ZERO_BD;
    this.amountUSD = ZERO_BD;
    this.feeLiquidity = ZERO_BD;
    this.sender = "";
    this.to = "";
    this.feeTo = "";
  }

  async fromDb(mdb: MintDb) {
    this._id = mdb._id;
    this.id = mdb.id;
    var t = new Transaction();
    t.justId(mdb.transaction);
    this.transaction = t;
    this.timestamp = mdb.timestamp;
    this.pair = await this.getPair(mdb.pair);
    this.liquidity = mdb.liquidity;
    this.amount0 = mdb.amount0;
    this.amount1 = mdb.amount1;
    this.logIndex = mdb.logIndex;
    this.amountUSD = mdb.amountUSD;
    this.feeLiquidity = mdb.feeLiquidity;
    this.sender = mdb.sender;
    this.to = mdb.to;
    this.feeTo = mdb.feeTo;
    return this;
  }
  async getPair(id:string):Promise<Pair>{
    const pair = await PairModel.find({id:id});
    return pair[0].toGenerated();
  }

  justId(id: string) {
    this.id = id;
  }
}