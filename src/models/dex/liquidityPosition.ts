import { getModelForClass, Prop as Property } from "@typegoose/typegoose";
import Decimal from "decimal.js";
import { ObjectId } from "mongodb";
import { Field, ID, ObjectType } from "type-graphql";
import { DecimalScalar } from "../../types/decimalScalar";
import { ObjectIdScalar } from "../../types/objectIdScalar";
import { Pair } from "./pair";
import { User } from "./user";

import { ZERO_BD } from "../../utils/constants";

// db object
export class LiquidityPositionDb {

  @Property({ default: "", required: false })
  readonly _id: ObjectId;

  @Property({ default: "", required: false })
  id: string;

  @Property({ default: "", required: false })
  user: string;

  @Property({ default: "", required: false })
  pair: string;

  @Property({ default: new Decimal("0"), required: false })
  liquidityTokenBalance: Decimal;

  constructor(id: string) {
    this._id = new ObjectId();
    this.id = id;
    this.user = "";
    this.pair = "";
    this.liquidityTokenBalance = ZERO_BD;
  }

  toGenerated() {
    var l = new LiquidityPosition()
    return l.fromDb(this);
  }
}


export const LiquidityPositionModel = getModelForClass(LiquidityPositionDb);

// graphql type
@ObjectType()
export class LiquidityPosition {
  @Field((type) => ObjectIdScalar)
  _id: ObjectId;

  @Field((type) => ID)
  id: string;

  @Field((type) => User)
  user: User;

  @Field((type) => Pair)
  pair: Pair;

  @Field((type) => DecimalScalar)
  liquidityTokenBalance: Decimal;

  constructor() {
    this._id = new ObjectId();
    this.id = "";
    this.user = new User();
    this.pair = new Pair();
    this.liquidityTokenBalance = ZERO_BD;
  }

  fromDb(position: LiquidityPositionDb) {
    this._id = position._id
    this.id = position.id;
    var u = new User();
    u.justId(position.user);
    this.user = u;
    var p = new Pair();
    p.justId(position.pair);
    this.pair = p; // todo:
    this.liquidityTokenBalance = position.liquidityTokenBalance;
    return this;
  }

  justId(id: string) {
    this.id = id;
  }
}
