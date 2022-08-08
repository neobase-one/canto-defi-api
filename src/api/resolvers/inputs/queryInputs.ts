import { Date } from "mongoose";
import { Field, InputType } from "type-graphql";

@InputType()
export class StableswapFactoryInput {
  @Field({ nullable: false })
  id: string

  @Field({ nullable: true })
  blockNumber: number
}

@InputType()
export class TokenDayDatasInput {
  @Field({ nullable: false })
  tokenAddress: string

  @Field({ nullable: true })
  orderBy: string

  @Field({ nullable: true })
  orderDirection: OrderDirection
  
  @Field({ nullable: true })
  date_gt: number
}

@InputType()
export class UniswapDayDatasInput {
  @Field({ nullable: false })
  tokenAddr: string

  @Field({ nullable: false })
  skip: number
}

@InputType()
export class BlocksInput {
  @Field(type => Date, { nullable: false })
  timestampFrom: Date

  @Field(type => Date, { nullable: false })
  timestampTo: Date
}

@InputType()
export class HealthInput {
  @Field({ nullable: false })
  subgraphName: string
}

@InputType()
export class TokenInput {
  @Field({ nullable: false })
  id: string
}

@InputType()
export class TokensInput {
  @Field(type => [String], { nullable: false })
  id: [string]
}

@InputType()
export class PairInput {
  @Field({ nullable: false })
  id: string
}

enum OrderDirection {
  ASC = "ASC",
  DES = "DES"
}
@InputType()
export class PairsInput {
  @Field(type => [String], { nullable: false })
  id: [string]

  @Field({ nullable: true })
  blockNumber: number

  @Field({ nullable: true })
  orderBy: string

  @Field(type => OrderDirection, { nullable: false })
  orderDirection: OrderDirection
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
export class TransactionsInput {
  @Field(type => [String], { nullable: false })
  id: [string]
  
  @Field({ nullable: true })
  orderBy: string
  
  @Field({ nullable: true })
  orderDirection: OrderDirection
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
  @Field({ nullable: true })
  id: string

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