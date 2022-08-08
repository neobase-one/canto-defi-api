import { getModelForClass, Prop as Property } from "@typegoose/typegoose";
import { ObjectId } from "mongodb";
import { ObjectType, Field, ID, Float, Int } from "type-graphql";
import { DecimalScalar } from "../types/decimalScalar";
import Decimal from "decimal.js";
import { User } from "./user";
import { Ref } from "../types/ref";
import { Pair } from "./pair";
import { ObjectIdScalar } from "../types/objectIdScalar";
import { EMPTY_PAIR, EMPTY_USER, ZERO_BD } from "../utils/constants";
@ObjectType()
export class LiquidityPosition {
  @Field((type) => ObjectIdScalar)
  @Property({ default: "", required: false })
  readonly _id: ObjectId;

  @Field((type) => ID)
  @Property({ default: "", required: false })
  id: string;

  @Field((type) => User)
  @Property({ ref: () => User, required: false })
  user?: Ref<User>; // todo ref

  @Field((type) => Pair)
  @Property({ ref: () => Pair, required: false })
  pair?: Ref<Pair>; // todo ref

  @Field((type) => DecimalScalar)
  @Property({ default: new Decimal("0"), required: false })
  liquidityTokenBalance: Decimal;

  constructor(id: string) {
    this._id = new ObjectId();
    this.id = id;
    this.user = EMPTY_USER;
    this.pair = EMPTY_PAIR;
    this.liquidityTokenBalance = ZERO_BD;
  }
}

export const LiquidityPositionModel = getModelForClass(LiquidityPosition);
