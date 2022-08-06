import { gql } from "apollo-server-core";

export const typeDefs = gql`
  scalar BigDecimal
  type StableswapFactory {
    # factory address
    id: ID!

    # pair info
    pairCount: Int!

    # total volume
    totalVolumeUSD: BigDecimal!
    totalVolumeETH: BigDecimal!

    # untracked values - less confident USD scores
    untrackedVolumeUSD: BigDecimal!

    # total liquidity
    totalLiquidityUSD: BigDecimal!
    totalLiquidityETH: BigDecimal!

    # TVL derived in USD
    totalValueLockedUSD: BigDecimal!
    # TVL derived in ETH
    totalValueLockedETH: BigDecimal!
    # TVL derived in USD untracked
    totalValueLockedUSDUntracked: BigDecimal!
    # TVL derived in ETH untracked
    totalValueLockedETHUntracked: BigDecimal!

    # transactions
    txCount: Int!
  }

  type Token {
    # token address
    id: ID!

    # mirrored from the smart contract
    symbol: String!
    name: String!
    decimals: BigDecimal!

    # used for other stats like marketcap
    totalSupply: BigDecimal!

    # token specific volume
    tradeVolume: BigDecimal!
    tradeVolumeUSD: BigDecimal!
    untrackedVolumeUSD: BigDecimal!

    # transactions across all pairs
    txCount: Int!

    # liquidity across all pairs
    totalLiquidity: BigDecimal!

    # derived prices
    derivedETH: BigDecimal

    # liquidity across all pools in token units
    totalValueLocked: BigDecimal!
    # liquidity across all pools in derived USD
    totalValueLockedUSD: BigDecimal!
    # TVL derived in USD untracked
    totalValueLockedUSDUntracked: BigDecimal!
    # derived price in ETH

    # derived fields
    tokenDayData: [TokenDayData!]!
    pairDayDataBase: [PairDayData!]!
    pairDayDataQuote: [PairDayData!]!
    pairBase: [Pair!]!
    pairQuote: [Pair!]!
  }

  type Pair {
    # pair address
    id: ID!

    # mirrored from the smart contract
    token0: Token!
    token1: Token!
    reserve0: BigDecimal!
    reserve1: BigDecimal!
    totalSupply: BigDecimal!

    # derived liquidity
    reserveETH: BigDecimal!
    reserveUSD: BigDecimal!
    # used for separating per pair reserves and global
    trackedReserveETH: BigDecimal!

    # Price in terms of the asset pair
    token0Price: BigDecimal!
    token1Price: BigDecimal!

    # lifetime volume stats
    volumeToken0: BigDecimal!
    volumeToken1: BigDecimal!
    volumeUSD: BigDecimal!
    untrackedVolumeUSD: BigDecimal!
    txCount: Int!

    # total token 0 across all ticks
    totalValueLockedToken0: BigDecimal!
    # total token 1 across all ticks
    totalValueLockedToken1: BigDecimal!
    # tvl derived ETH
    totalValueLockedETH: BigDecimal!
    # tvl USD
    totalValueLockedUSD: BigDecimal!
    # TVL derived in USD untracked
    totalValueLockedUSDUntracked: BigDecimal!

    # creation stats
    createdAtTimestamp: Int!
    createdAtBlockNumber: Int!

    # Fields used to help derived relationship
    liquidityProviderCount: Int! # used to detect new exchanges
    # derived fields
    pairHourData: [PairHourData!]!
    liquidityPositions: [LiquidityPosition!]!
    liquidityPositionSnapshots: [LiquidityPositionSnapshot!]!
    mints: [Mint!]!
    burns: [Burn!]!
    swaps: [Swap!]!
  }

  type User {
    id: ID!
    liquidityPositions: [LiquidityPosition!]
    usdSwapped: BigDecimal!
  }

  type LiquidityPosition {
    id: ID!
    user: User!
    pair: Pair!
    liquidityTokenBalance: BigDecimal!
  }

  # saved over time for return calculations, gets created and never updated
  type LiquidityPositionSnapshot {
    id: ID!
    liquidityPosition: LiquidityPosition!
    timestamp: Int! # saved for fast historical lookups
    block: Int! # saved for fast historical lookups
    user: User! # reference to user
    pair: Pair! # reference to pair
    token0PriceUSD: BigDecimal! # snapshot of token0 price
    token1PriceUSD: BigDecimal! # snapshot of token1 price
    reserve0: BigDecimal! # snapshot of pair token0 reserves
    reserve1: BigDecimal! # snapshot of pair token1 reserves
    reserveUSD: BigDecimal! # snapshot of pair reserves in USD
    liquidityTokenTotalSupply: BigDecimal! # snapshot of pool token supply
    liquidityTokenBalance: BigDecimal! # snapshot of users pool token balance
  }

  type Transaction {
    id: ID! # txn hash
    blockNumber: Int!
    timestamp: Int!
    # This is not the reverse of Mint.transaction; it is only used to
    # track incomplete mints (similar for burns and swaps)
    mints: [Mint]!
    burns: [Burn]!
    swaps: [Swap]!
  }

  type Mint {
    # transaction hash + "-" + index in mints Transaction array
    id: ID!
    transaction: Transaction!
    timestamp: Int! # need this to pull recent txns for specific token or pair
    pair: Pair!

    # populated from the primary Transfer event
    to: String! # Bytes
    liquidity: BigDecimal!

    # populated from the Mint event
    sender: String # Bytes
    amount0: BigDecimal
    amount1: BigDecimal
    logIndex: Int
    # derived amount based on available prices of tokens
    amountUSD: BigDecimal

    # optional fee fields, if a Transfer event is fired in _mintFee
    feeTo: String # Bytes
    feeLiquidity: BigDecimal
  }

  type Burn {
    # transaction hash + "-" + index in mints Transaction array
    id: ID!
    transaction: Transaction!
    timestamp: Int! # need this to pull recent txns for specific token or pair
    pair: Pair!

    # populated from the primary Transfer event
    liquidity: BigDecimal!

    # populated from the Burn event
    sender: String # Bytes
    amount0: BigDecimal
    amount1: BigDecimal
    to: String # Bytes
    logIndex: Int
    # derived amount based on available prices of tokens
    amountUSD: BigDecimal

    # mark uncomplete in ETH case
    needsComplete: Boolean!

    # optional fee fields, if a Transfer event is fired in _mintFee
    feeTo: String # Bytes
    feeLiquidity: BigDecimal
  }

  type Swap {
    # transaction hash + "-" + index in swaps Transaction array
    id: ID!
    transaction: Transaction!
    timestamp: Int! # need this to pull recent txns for specific token or pair
    pair: Pair!

    # populated from the Swap event
    sender: String! # Bytes
    from: String! # the EOA that initiated the txn # Bytes
    amount0In: BigDecimal!
    amount1In: BigDecimal!
    amount0Out: BigDecimal!
    amount1Out: BigDecimal!
    to: String! # Bytes
    logIndex: Int

    # derived info
    amountUSD: BigDecimal!
  }

  # stores for USD calculations
  type Bundle {
    id: ID!
    ethPrice: BigDecimal! # price of ETH usd
  }

  # Data accumulated and condensed into day stats for all of Stableswap
  type StableswapDayData {
    id: ID! # timestamp rounded to current day by dividing by 86400
    date: Int!

    dailyVolumeETH: BigDecimal!
    dailyVolumeUSD: BigDecimal!
    dailyVolumeUntracked: BigDecimal!

    totalVolumeETH: BigDecimal!
    totalLiquidityETH: BigDecimal!
    totalVolumeUSD: BigDecimal! # Accumulate at each trade, not just calculated off whatever totalVolume is. making it more accurate as it is a live conversion
    totalLiquidityUSD: BigDecimal!

    # tvl in terms of USD
    tvlUSD: BigDecimal!

    txCount: Int!
  }

  type PairHourData {
    id: ID!
    hourStartUnix: Int! # unix timestamp for start of hour
    pair: Pair!

    # reserves
    reserve0: BigDecimal!
    reserve1: BigDecimal!

    # total supply for LP historical returns
    totalSupply: BigDecimal!

    # derived liquidity
    reserveUSD: BigDecimal!

    # volume stats
    hourlyVolumeToken0: BigDecimal!
    hourlyVolumeToken1: BigDecimal!
    hourlyVolumeUSD: BigDecimal!
    hourlyTxns: Int!

    # tvl derived in USD at end of period
    tvlUSD: BigDecimal!
  }

  # Data accumulated and condensed into day stats for each exchange
  type PairDayData {
    id: ID!
    date: Int!
    pairAddress: String! # Bytes
    token0: Token!
    token1: Token!

    # reserves
    reserve0: BigDecimal!
    reserve1: BigDecimal!

    # total supply for LP historical returns
    totalSupply: BigDecimal!

    # derived liquidity
    reserveUSD: BigDecimal!

    # volume stats
    dailyVolumeToken0: BigDecimal!
    dailyVolumeToken1: BigDecimal!
    dailyVolumeUSD: BigDecimal!
    dailyTxns: Int!

    # tvl derived in USD at end of period
    tvlUSD: BigDecimal!
  }

  type TokenDayData {
    id: ID!
    date: Int!
    token: Token!

    # volume stats
    dailyVolumeToken: BigDecimal!
    dailyVolumeETH: BigDecimal!
    dailyVolumeUSD: BigDecimal!
    dailyTxns: Int!

    # liquidity stats
    totalLiquidityToken: BigDecimal!
    totalLiquidityETH: BigDecimal!
    totalLiquidityUSD: BigDecimal!

    # price stats
    priceUSD: BigDecimal!

    # liquidity across all pools in token units
    totalValueLocked: BigDecimal!
    # liquidity across all pools in derived USD
    totalValueLockedUSD: BigDecimal!
  }

  type Block {
    id: ID
    number: Int
    timestamp: Int
  }

  type Query {
    health: String
    blocks(input: BlocksInput): [Block!]!
    stableswapFactory(input: StableswapFactoryInput): StableswapFactory
    stableswapFactories(input: StableswapFactoriesInput): [StableswapFactory!]!
    token(input: TokenInput): Token
    tokens(input: TokensInput): [Token!]!
    pair(input: PairInput): Pair
    pairs(input: PairsInput): [Pair!]!
    user(input: UserInput): User
    users(input: UsersInput): [User!]
    liquidityPosition(input: LiquidityPositionInput): LiquidityPosition
    liquidityPositions(input: LiquidityPositionsInput): [LiquidityPosition!]!
    liquidityPositionSnapshot(
      input: LiquidityPositionSnapshotInput
    ): LiquidityPositionSnapshot
    liquidityPositionSnapshots(
      input: LiquidityPositionSnapshotsInput
    ): [LiquidityPositionSnapshot!]!
    transaction(input: TransactionInput): Transaction
    transactions(input: TransactionsInput): [Transaction!]
    mint(input: MintInput): Mint
    mints(input: MintsInput): [Mint!]
    burn(input: BurnInput): Burn
    burns(input: BurnsInput): [Burn!]
    swap(input: SwapInput): Swap
    swaps(input: SwapsInput): [Swap!]
    bundle(input: BundleInput): Bundle
    bundles(input: BundlesInput): [Bundle!]
    stableswapDayData(input: StableswapDayDataInput): StableswapDayData
    stableswapDayDatas(input: StableswapDayDatasInput): [StableswapDayData!]
    pairHourData(input: PairDayDataInput): PairDayData
    pairHourDatas(input: PairDayDatasInput): [PairDayData!]
    pairDayData(input: PairDayDataInput): PairDayData
    pairDayDatas(input: PairDayDatasInput): [PairDayData!]
    tokenDayData(input: TokenDayDataInput): TokenDayData
    tokenDayDatas(input: TokenDayDatasInput): [TokenDayData!]
  }
  input BlocksInput {
    timestampFrom: Int!
    timestampTo: Int!
  }
  input StableswapFactoryInput {
    id: String!
  }
  input StableswapFactoriesInput {
    id: String
    blockNumber: Int
  }
  input TokenInput {
    id: String!
  }
  input TokensInput {
    id: [String!]
  }
  input PairInput {
    id: String!
  }
  input PairsInput {
    id: [String!]
    blockNumber: Int
    # expect: "reserveUSD", "trackedReserveETH"
    orderBy: String
    orderDirection: OrderDirection
  }
  input UserInput {
    id: String!
  }
  input UsersInput {
    id: String!
  }
  input LiquidityPositionInput {
    id: String!
  }
  input LiquidityPositionsInput {
    id: String!
  }
  input LiquidityPositionSnapshotInput {
    id: String!
  }
  input LiquidityPositionSnapshotsInput {
    id: String!
  }
  input TransactionInput {
    id: String!
  }
  input TransactionsInput {
    id: [String!]
    # expect: "timestamp"
    orderBy: String
    orderDirection: OrderDirection
  }
  input MintInput {
    id: String!
  }
  input MintsInput {
    id: String!
  }
  input BurnInput {
    id: String!
  }
  input BurnsInput {
    id: String!
  }
  input SwapInput {
    id: String!
  }
  input SwapsInput {
    id: String!
  }
  input BundleInput {
    id: String!
  }
  input BundlesInput {
    id: String
    blockNumber: Int
  }
  input StableswapDayDataInput {
    id: String!
  }
  input StableswapDayDatasInput {
    startTime: Int
    # expect: "date",
    orderBy: String
    orderDirection: OrderDirection
    date_gt: Int
  }
  input PairDayDataInput {
    id: String!
  }
  input PairDayDatasInput {
    id: String!
  }
  input PairDayDataInput {
    id: String!
  }
  input PairDayDatasInput {
    id: String!
  }
  input TokenDayDataInput {
    id: String!
  }
  input TokenDayDatasInput {
    tokenAddress: String
    # expect: "date", "totalLiquidityUSD"
    orderBy: String
    orderDirection: OrderDirection
    date_gt: Int
  }
  enum OrderDirection {
    ASC
    DES
  }
`;
