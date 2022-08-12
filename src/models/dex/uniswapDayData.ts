import { getModelForClass, Prop as Property } from "@typegoose/typegoose";
import { ObjectId } from "mongodb";
import { ObjectType, Field, ID, Float, Int } from "type-graphql";
import { DecimalScalar } from "../../types/decimalScalar";
import Decimal from "decimal.js";
import { ObjectIdScalar } from "../../types/objectIdScalar";

@ObjectType()
export class UniswapDayData {
  @Field((type) => ObjectIdScalar)
  @Property({ default: "", required: false })
  readonly _id: ObjectId;

  @Field((type) => ID)
  @Property({ default: "", required: false })
  id: string;

  @Field()
  @Property({ default: 0, required: false })
  date: number;

  @Field((type) => DecimalScalar)
  @Property({ default: new Decimal("0"), required: false })
  totalVolumeUSD: Decimal;

  @Field((type) => DecimalScalar)
  @Property({ default: new Decimal("0"), required: false })
  dailyVolumeUSD: Decimal;

  @Field((type) => DecimalScalar)
  @Property({ default: new Decimal("0"), required: false })
  dailyVolumeETH: Decimal;

  @Field((type) => DecimalScalar)
  @Property({ default: new Decimal("0"), required: false })
  totalLiquidityETH: Decimal;

  @Field((type) => DecimalScalar)
  @Property({ default: new Decimal("0"), required: false })
  totalLiquidityUSD: Decimal;
}

export const UniswapDayDataModel = getModelForClass(UniswapDayData);
