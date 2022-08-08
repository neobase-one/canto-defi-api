import { getModelForClass, Prop as Property } from "@typegoose/typegoose";
import { ObjectId } from "mongodb";
import { ObjectType, Field, ID, Float, Int } from "type-graphql";
import { DecimalScalar } from "../types/decimalScalar";
import Decimal from "decimal.js";
import { User, UserType } from "./user";
import { Ref } from "../types/ref";
import { Pair } from "./pair";
import { ObjectIdScalar } from "../types/objectIdScalar";
import { EMPTY_PAIR, EMPTY_USER, ZERO_BD } from "../utils/constants";

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
    this.user = EMPTY_USER;
    this.pair = EMPTY_PAIR;
    this.liquidityTokenBalance = ZERO_BD;
  }

  toGenerated() {
    return new LiquidityPosition(this)
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

  constructor(position: LiquidityPositionDb) {
    this._id = position._id
    this.id = position.id;
    this.user = new User(position.user);
    this.pair = new Position(position.pair); // todo:
    this.liquidityTokenBalance = position.liquidityTokenBalance;
  }

  constructor (id: string) {
    this.id = id
  }
}