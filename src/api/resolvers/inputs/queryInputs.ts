import { Date } from "mongoose";
import { Field, InputType } from "type-graphql";

@InputType()
export class StableswapFactoryInput {
  @Field({nullable: false})
  id: string
}

@InputType()
export class TokenDayDatasInput {
  @Field({nullable: false})
  tokenAddr: string 
 
  @Field({nullable:false})
  skip: number
}

@InputType()
export class UniswapDayDatasInput {
  @Field({nullable: false})
  tokenAddr: string 
 
  @Field({nullable:false})
  skip: number
}

@InputType()
export class BlocksInput {
  @Field({nullable: false})
  timestampFrom: Date
 
  @Field({nullable:false})
  timestampTo: Date
}

@InputType()
export class HealthInput {
  @Field({nullable: false})
  subgraphName: string
}