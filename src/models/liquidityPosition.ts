import { getModelForClass, Prop as Property } from "@typegoose/typegoose";
import { ObjectId } from "mongodb";
import { ObjectType, Field, ID, Float, Int } from "type-graphql";
import { DecimalScalar } from "../types/decimalScalar";
import Decimal from "decimal.js";
import { User } from "./user";
import { Ref } from "../types/ref";
import { Pair } from "./pair";
import { ObjectIdScalar } from "../types/objectIdScalar";
@ObjectType()
export class LiquidityPosition {
  @Field((type) => ObjectIdScalar)
  @Property({ default: "", required: true })
  readonly _id: ObjectId;

  @Field((type) => ID)
  @Property({ default: "", required: true })
  id: string;

  @Field((type) => User)
  @Property({ ref: User, required: true })
  user: Ref<User>;

  @Field((type) => Pair)
  @Property({ ref: Pair, required: true })
  pair: Ref<Pair>;

  @Field((type) => DecimalScalar)
  @Property({ default: new Decimal("0"), required: true })
  liquidityTokenBalance: Decimal;
}

export const LiquidityPositionModel = getModelForClass(LiquidityPosition);
