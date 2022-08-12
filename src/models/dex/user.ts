import { getModelForClass, Prop as Property } from "@typegoose/typegoose";
import { ObjectId } from "mongodb";
import { Field, ObjectType, ID } from "type-graphql";
import { DecimalScalar } from "../../types/decimalScalar";
import Decimal from "decimal.js";
import { LiquidityPosition } from "./liquidityPosition";
import { ObjectIdScalar } from "../../types/objectIdScalar";


export class UserDb {
  readonly _id: ObjectId;

  @Property({ default: "", required: false })
  id: string;

  @Property({ default: "", required: false })
  liquidityPosition: string;

  @Property({ default: new Decimal("0"), required: false })
  usdSwapped: Decimal; // todo: change to canto

  constructor(id: string) {
    this._id = new ObjectId();
    this.id = id;
    this.liquidityPosition = "";
    this.usdSwapped = new Decimal(0); // todo: change to canto
  }

  toGenerated() {
    var m = new User()
    return m.fromDb(this);
  }
}


export const UserModel = getModelForClass(UserDb);

// graphql object
// NOTE: the name you give @ObjectType will be name of return object in graphql
@ObjectType()
export class User {
  @Field((type) => ObjectIdScalar)
  _id: ObjectId;

  @Field((type) => ID)
  id: string;

  @Field((type) => LiquidityPosition)
  liquidityPosition: LiquidityPosition;

  @Field((type) => DecimalScalar)
  usdSwapped: Decimal;

  constructor() {
    this._id = new ObjectId();
    this.id = "";
    this.liquidityPosition = new LiquidityPosition();
    this.usdSwapped = new Decimal(0);
  }

  fromDb(user: UserDb) {
    this._id = user._id;
    this.id = user.id;
    var l = new LiquidityPosition();
    l.justId(user.liquidityPosition);
    this.liquidityPosition = l;
    this.usdSwapped = user.usdSwapped;
  }

  justId(id: string) {
    this.id = id;
  }
}
