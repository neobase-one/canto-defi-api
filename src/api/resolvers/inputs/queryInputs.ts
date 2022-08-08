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