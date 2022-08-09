import { Field, InputType, Int } from "type-graphql";

enum OrderDirection {
  ASC = "ASC",
  DES = "DES"
}

@InputType()
export class StableswapFactoryInput {
  @Field({ nullable: false })
  id: string

  @Field({ nullable: true })
  blockNumber: number
}

@InputType()
export class TokenDayDatasInput {
  @Field({ nullable: true })
  tokenAddress: string

  @Field({ nullable: true })
  skip: number

  @Field({ nullable: true })
  orderBy: string

  @Field({ nullable: true })
  orderDirection: OrderDirection
  
  @Field({ nullable: true })
  date_gt: number
}

@InputType()
export class UniswapFactoriesInput {
  @Field({nullable: false})
  id: string

  @Field({nullable:true})
  block: number
}
@InputType()
export class UniswapDayDatasInput {
  @Field((type) => Int,{ nullable: false })
  startTime: number

  @Field({ defaultValue:0, nullable: true })
  skip: number

  @Field({ defaultValue:1000, nullable: true })
  first: number
  
  @Field({ defaultValue:"date",nullable: true })
  orderBy: string
  
  @Field({ defaultValue:OrderDirection.ASC,nullable: true })
  orderDirection: OrderDirection
}

@InputType()
export class BlocksInput {
  @Field({ nullable: false })
  timestampFrom: number

  @Field({ nullable: false })
  timestampTo: number
}

@InputType()
export class HealthInput {
  @Field({ nullable: false })
  subgraphName: string
}

@InputType()
export class TokenInput {
  @Field({ nullable: true })
  id: string

  @Field({ nullable: true })
  skip: number  
}

@InputType()
export class PairInput {
  @Field({ nullable: false })
  id: string
}

@InputType()
export class UserInput {
  @Field({ nullable: false })
  id: string
}

@InputType()
export class UsersInput {
  @Field({ nullable: false })
  id: string
}

@InputType()
export class LiquidityPositionInput {
  @Field({ nullable: false })
  id: string
}

@InputType()
export class LiquidityPositionsInput {
  @Field({ nullable: false })
  id: string
}

@InputType()
export class LiquidityPositionSnapshotInput {
  @Field({ nullable: false })
  id: string
}

@InputType()
export class LiquidityPositionSnapshotsInput {
  @Field({ nullable: false })
  id: string
}

@InputType()
export class TransactionInput {
  @Field({ nullable: false })
  id: string
}

@InputType()
export class MintInput {
  @Field({ nullable: false })
  id: string
}

@InputType()
export class MintsInput {
  @Field({ nullable: false })
  id: string
}

@InputType()
export class BurnInput {
  @Field({ nullable: false })
  id: string
}

@InputType()
export class BurnsInput {
  @Field({ nullable: false })
  id: string
}

@InputType()
export class SwapInput {
  @Field({ nullable: false })
  id: string
}

@InputType()
export class SwapsInput {
  @Field({ nullable: false })
  id: string
}

@InputType()
export class BundleInput {
  @Field({ nullable: false })
  id: string
}

@InputType()
export class BundlesInput {
  @Field({ nullable: false })
  id: number

  @Field({ nullable: true })
  blockNumber: number
}

@InputType()
export class StableswapDayDataInput {
  @Field({ nullable: false })
  id: string
}

@InputType()
export class StableswapDayDatasInput {
  @Field({ nullable: true })
  startTime: number
  @Field({ nullable: true })
  orderBy: string
  @Field({ nullable: true })
  orderDirection: OrderDirection
  @Field({ nullable: true })
  date_gt: number
}

@InputType()
export class PairDayDataInput {
  @Field({ nullable: false })
  id: string
}

@InputType()
export class PairDayDatasInput {
  @Field({ nullable: false })
  id: string
}

@InputType()
export class TokenDayDataInput {
  @Field({ nullable: false })
  id: string
}