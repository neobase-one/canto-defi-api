import { getModelForClass, Prop as Property } from "@typegoose/typegoose";
import { ObjectId } from "mongodb";
import { Field, ObjectType, ID } from "type-graphql";
import { DecimalScalar } from "../types/decimalScalar";
import Decimal from "decimal.js";
import { LiquidityPosition } from "./liquidityPosition";
import { Ref } from "../types/ref";
import { ObjectIdScalar } from "../types/objectIdScalar";

@ObjectType()
export class User {
  @Field((type) => ObjectIdScalar)
  readonly _id: ObjectId;

  @Field((type) => ID)
  @Property({ default: "", required: false })
  id: string;

  @Field((type) => LiquidityPosition)
  @Property({ ref: LiquidityPosition, required: false })
  liquidityPosition: string; //todo: ref

  @Field((type) => DecimalScalar)
  @Property({ default: new Decimal("0"), required: false })
  usdSwapped: Decimal; // todo: change to canto

  constructor (id: string) {
    this. _id= new ObjectId();
    this.id = id;
    this.liquidityPosition = "";
    this.usdSwapped = new Decimal(0); // todo: change to canto
  }
}

export const UserModel = getModelForClass(User);
