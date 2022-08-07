import { Field, InputType } from "type-graphql";

@InputType()
export class StableswapFactoryInput {
  @Field({nullable: false})
  id: string
}
