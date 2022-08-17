import { getModelForClass } from "@typegoose/typegoose";
import Decimal from "decimal.js";
import { Document } from "mongodb";
import Container from "typedi";
import { EventData } from "web3-eth-contract";
import { Config } from "../../../config";
import { web3 } from "../../../loaders/web3";
import { Bundle, BundleDb, BundleModel } from "../../../models/dex/bundle";
import { BurnDb, BurnModel } from "../../../models/dex/burn";
import {
  LiquidityPositionModel
} from "../../../models/dex/liquidityPosition";
import { MintDb, MintModel } from "../../../models/dex/mint";
import { PairDb, PairModel } from "../../../models/dex/pair";
import { PairDayDataDb, PairDayDataModel } from "../../../models/dex/pairDayData";
import { PairHourDataDb, PairHourDataModel } from "../../../models/dex/pairHourData";
import { StableswapDayDataDb, StableswapDayDataModel } from "../../../models/dex/stableswapDayData";
import {
  StableswapFactoryDb,
  StableswapFactoryModel
} from "../../../models/dex/stableswapFactory";
import { SwapDb, SwapModel } from "../../../models/dex/swap";
import { TokenDb, TokenModel } from "../../../models/dex/token";
import { TokenDayDataDb, TokenDayDataModel } from "../../../models/dex/tokenDayData";
import { TransactionDb, TransactionModel } from "../../../models/dex/transaction";
import {
  BurnEventInput,
  MintEventInput,
  SwapEventInput,
  SyncEventInput,
  TransferEventInput
} from "../../../types/event/dex/baseV1Pair";
import { BaseV1PairABI } from "../../../utils/abiParser/baseV1Pair";
import { ADDRESS_ZERO, BI_18, ONE_BD, ZERO_BD } from "../../../utils/constants";
import { convertToDecimal, convertTokenToDecimal, getTimestamp } from "../../../utils/helper";
import { BundleService } from "../models/bundle";
import { BurnService } from "../models/burn";
import { MintService } from "../models/mint";
import { PairService } from "../models/pair";
import { StableswapFactoryService } from "../models/stableswapFactory";
import { TokenService } from "../models/token";
import { TransactionService } from "../models/transaction";
import {
  createLiquidityPosition,
  createLiquiditySnapshot,
  createUser
} from "./liquidity";
import {
  updateFactoryDayData, updatePairDayData,
  updatePairHourData, updateTokenDayData
} from "./metrics";
import {
  findCantoPerToken,
  getCantoPriceInUSD,
  getTrackedLiquidityUSD,
  getTrackedVolumeUSD
} from "./pricing";

// todo: remove unused services

export async function mintEventHandler(
  event: EventData,
  input: MintEventInput
) {
  const FACTORY_ADDRESS = Config.contracts.baseV1Factory.addresses[0];
  const txHash = event.transactionHash;

  // service
  const factoryService = Container.get(StableswapFactoryService);
  const pairService = Container.get(PairService);
  const tokenService = Container.get(TokenService);
  const bundleService = Container.get(BundleService);
  const transactionService = Container.get(TransactionService);
  const burnService = Container.get(BurnService);
  const mintService = Container.get(MintService);

  // load
  let factory: StableswapFactoryDb = await factoryService.getByAddress(FACTORY_ADDRESS) as StableswapFactoryDb;
  let transaction: TransactionDb = await transactionService.getByHash(txHash) as TransactionDb;
  let pair: PairDb = await pairService.getByAddress(event.address) as PairDb;
  let token0: TokenDb = await tokenService.getByAddress(pair.token0) as TokenDb;
  let token1: TokenDb = await tokenService.getByAddress(pair.token1) as TokenDb;

  let mints = transaction.mints;
  let mint: MintDb = await mintService.getById(mints[mints.length - 1]) as MintDb;

  // update exchange info (excpet balances, sync will cover that)
  let token0Amount = convertTokenToDecimal(input.amount0, token0.decimals);
  let token1Amount = convertTokenToDecimal(input.amount1, token1.decimals);

  // update txn counts
  // console.log(token0.txCount)
  token0.txCount = convertToDecimal(token0.txCount).plus(ONE_BD);
  token1.txCount = convertToDecimal(token1.txCount).plus(ONE_BD);

  // get new amount of USD and CANTO for tracking
  let bundle: BundleDb = await bundleService.get() as BundleDb;
  let amountTotalCANTO = convertToDecimal(token1.derivedCANTO)
    .times(token1Amount)
    .plus(convertToDecimal(token0.derivedCANTO).times(token0Amount));
  let amountTotalUSD = amountTotalCANTO.times(convertToDecimal(bundle.cantoPrice));
  // let amountTotalUSD = amountTotalCANTO;

  // update txn counts
  pair.txCount = convertToDecimal(pair.txCount).plus(ONE_BD);
  factory.txCount = convertToDecimal(factory.txCount).plus(ONE_BD);

  // save entities
  await new TokenModel(token0).save();
  await new TokenModel(token1).save();
  await new PairModel(pair).save();
  await new StableswapFactoryModel(factory).save();

  // update mint
  mint.sender = input.sender;
  mint.amount0 = token0Amount;
  mint.amount1 = token1Amount;
  mint.logIndex = new Decimal(event.logIndex);
  mint.amountUSD = amountTotalUSD; // todo: add amountTotalCANTO
  await new MintModel(mint).save();

  // update LP position
  let liquidityPosition = await createLiquidityPosition(event.address, mint.to);
  await createLiquiditySnapshot(liquidityPosition, event);

  // update day metric objects
  await updatePairDayData(event);
  await updatePairHourData(event);
  await updateFactoryDayData(event);
  await updateTokenDayData(token0, event);
  await updateTokenDayData(token1, event);
}

export async function burnEventHandler(
  event: EventData,
  input: BurnEventInput
) {
  const FACTORY_ADDRESS = Config.contracts.baseV1Factory.addresses[0];
  const txHash = event.transactionHash;

  // service
  const factoryService = Container.get(StableswapFactoryService);
  const pairService = Container.get(PairService);
  const tokenService = Container.get(TokenService);
  const bundleService = Container.get(BundleService);
  const transactionService = Container.get(TransactionService);
  const burnService = Container.get(BurnService);
  const mintService = Container.get(MintService);

  // load
  let factory: StableswapFactoryDb = await factoryService.getByAddress(FACTORY_ADDRESS) as StableswapFactoryDb;
  let transaction: TransactionDb = await transactionService.getByHash(txHash) as TransactionDb;
  if (transaction === null) {
    return;
  }
  let pair: PairDb = await pairService.getByAddress(event.address) as PairDb;
  let token0: TokenDb = await tokenService.getByAddress(pair.token0) as TokenDb;
  let token1: TokenDb = await tokenService.getByAddress(pair.token1) as TokenDb;

  // burns
  let burns = transaction.burns;
  let burn: BurnDb = await burnService.getById(burns[burns.length - 1]) as BurnDb;

  // update token info
  let token0Amount = convertTokenToDecimal(input.amount0, token0.decimals);
  let token1Amount = convertTokenToDecimal(input.amount1, token1.decimals);

  // update txn counts
  token0.txCount = convertToDecimal(token0.txCount).plus(ONE_BD);
  token1.txCount = convertToDecimal(token1.txCount).plus(ONE_BD);

  // get new amount of USD and CANTO for tracking
  let bundle: BundleDb = await bundleService.get() as BundleDb;
  let amountTotalCANTO = convertToDecimal(token1.derivedCANTO)
    .times(token1Amount)
    .plus(convertToDecimal(token0.derivedCANTO).times(token0Amount));
  let amountTotalUSD = amountTotalCANTO.times(convertToDecimal(bundle.cantoPrice));
  // let amountTotalUSD = amountTotalCANTO;

  // update txn counts
  pair.txCount = convertToDecimal(pair.txCount).plus(ONE_BD);
  factory.txCount = convertToDecimal(factory.txCount).plus(ONE_BD);

  // save entities
  await new TokenModel(token0).save();
  await new TokenModel(token1).save();
  await new PairModel(pair).save();
  await new StableswapFactoryModel(factory).save();

  // update burn
  burn.amount0 = token0Amount;
  burn.amount1 = token1Amount;
  burn.logIndex = new Decimal(event.logIndex);
  burn.amountUSD = amountTotalUSD; // todo: add amountTotalCANTO field
  await new BurnModel(burn).save();

  // update LP position
  let liquidityPosition = await createLiquidityPosition(
    event.address,
    burn.sender
  );
  await createLiquiditySnapshot(liquidityPosition, event);

  // update day metric objects
  await updatePairDayData(event);
  await updatePairHourData(event);
  await updateFactoryDayData(event);
  await updateTokenDayData(token0, event);
  await updateTokenDayData(token1, event);
}

export async function swapEventHandler(
  event: EventData,
  input: SwapEventInput
) {
  const FACTORY_ADDRESS = Config.contracts.baseV1Factory.addresses[0];
  const txHash = event.transactionHash;
  const timestamp = await getTimestamp(event.blockNumber);

  // service
  const factoryService = Container.get(StableswapFactoryService);
  const pairService = Container.get(PairService);
  const tokenService = Container.get(TokenService);
  const bundleService = Container.get(BundleService);
  const transactionService = Container.get(TransactionService);
  const burnService = Container.get(BurnService);
  const mintService = Container.get(MintService);

  // load
  let factory: StableswapFactoryDb = await factoryService.getByAddress(FACTORY_ADDRESS) as StableswapFactoryDb;
  let pair: PairDb = await pairService.getByAddress(event.address) as PairDb;
  let token0: TokenDb = await tokenService.getByAddress(pair.token0) as TokenDb;
  let token1: TokenDb = await tokenService.getByAddress(pair.token1) as TokenDb;

  //
  let amount0In = convertTokenToDecimal(input.amount0In, token0.decimals);
  let amount1In = convertTokenToDecimal(input.amount1In, token1.decimals);
  let amount0Out = convertTokenToDecimal(input.amount0Out, token0.decimals);
  let amount1Out = convertTokenToDecimal(input.amount1Out, token1.decimals);

  // totals for volume updates
  let amount0Total = amount0Out.plus(amount0In);
  let amount1Total = amount1Out.plus(amount1In);

  // get new amount of USD and CANTO for tracking
  let bundle: BundleDb = await bundleService.get() as BundleDb;

  // get total amounts of derived USD and CANTO for tracking
  let derivedAmountCANTO = convertToDecimal(token1.derivedCANTO)
    .times(amount1Total)
    .plus(convertToDecimal(token0.derivedCANTO).times(amount0Total))
    .div(new Decimal("2"));
  let derivedAmountUSD = derivedAmountCANTO.times(convertToDecimal(bundle.cantoPrice));
  // let derivedAmountUSD = derivedAmountCANTO;

  // only accounts for volume through white listed tokens
  let trackedAmountUSD = await getTrackedVolumeUSD(
    amount0Total,
    token0,
    amount1Total,
    token1,
    pair
  );

  let trackedAmountCANTO: Decimal = trackedAmountUSD;
  if (convertToDecimal(bundle.cantoPrice).equals(ZERO_BD)) {
    trackedAmountCANTO = ZERO_BD;
  } else {
    trackedAmountCANTO = trackedAmountUSD.div(convertToDecimal(bundle.cantoPrice));
  }

  // update token0 global volume and token liquidity stats
  token0.tradeVolume = convertToDecimal(token0.tradeVolume).plus(amount0In.plus(amount0Out));
  token0.tradeVolumeUSD = convertToDecimal(token0.tradeVolumeUSD).plus(trackedAmountUSD);
  token0.untrackedVolumeUSD = convertToDecimal(token0.untrackedVolumeUSD).plus(derivedAmountUSD);

  // update token1 global volume and token liquidity stats
  token1.tradeVolume = convertToDecimal(token1.tradeVolume).plus(amount1In.plus(amount1Out));
  token1.tradeVolumeUSD = convertToDecimal(token1.tradeVolumeUSD).plus(trackedAmountUSD);
  token1.untrackedVolumeUSD = convertToDecimal(token1.untrackedVolumeUSD).plus(derivedAmountUSD);

  // update txn counts
  token0.txCount = convertToDecimal(token0.txCount).plus(ONE_BD);
  token1.txCount = convertToDecimal(token1.txCount).plus(ONE_BD);

  // update pair volume data, use tracked amount if we have it as its probably more accurate
  pair.volumeUSD = convertToDecimal(pair.volumeUSD).plus(trackedAmountUSD);
  pair.volumeToken0 = convertToDecimal(pair.volumeToken0).plus(amount0Total);
  pair.volumeToken1 = convertToDecimal(pair.volumeToken1).plus(amount1Total);
  pair.untrackedVolumeUSD = convertToDecimal(pair.untrackedVolumeUSD).plus(derivedAmountUSD);
  pair.txCount = convertToDecimal(pair.txCount).plus(ONE_BD);
  await new PairModel(pair).save();

  // update global values, only used tracked amounts for volume
  factory.totalVolumeUSD = convertToDecimal(factory.totalVolumeUSD).plus(trackedAmountUSD);
  factory.totalVolumeCANTO = convertToDecimal(factory.totalVolumeCANTO).plus(trackedAmountCANTO);
  factory.untrackedVolumeUSD =
    convertToDecimal(factory.untrackedVolumeUSD).plus(derivedAmountUSD);
  factory.txCount = convertToDecimal(factory.txCount).plus(ONE_BD);

  // save entities
  await new PairModel(pair).save();
  await new TokenModel(token0).save();
  await new TokenModel(token1).save();
  await new StableswapFactoryModel(factory).save();

  // update transaction
  let transaction: TransactionDb = await transactionService.getByHash(txHash) as TransactionDb;
  if (transaction === null) {
    transaction = new TransactionDb(txHash);
    transaction.blockNumber = new Decimal(event.blockNumber);
    transaction.timestamp = timestamp;
    transaction.mints = [];
    transaction.swaps = [];
    transaction.burns = [];
  }

  // swaps
  let swaps = transaction.swaps;
  const swapId = txHash
    .concat("-")
    .concat(new Decimal(swaps.length).toString());
  let swap = new SwapDb(swapId);

  // update swap
  swap.transaction = transaction.id;
  swap.pair = pair.id;
  swap.timestamp = transaction.timestamp;
  swap.sender = input.sender;
  swap.amount0In = amount0In;
  swap.amount1In = amount1In;
  swap.amount0Out = amount0Out;
  swap.amount1Out = amount1Out;
  swap.to = input.to;
  // swap.from = event.transaction.from
  swap.from = input.sender;
  swap.logIndex = new Decimal(event.logIndex);
  if (trackedAmountUSD === ZERO_BD) {
    swap.amountUSD = derivedAmountUSD;
  } else {
    swap.amountUSD = trackedAmountUSD;
  }
  await new SwapModel(swap).save();

  // update transaction
  swaps.push(swap.id);
  transaction.swaps = swaps;
  await new TransactionModel(transaction).save();

  // update day entities
  let pairDayData: PairDayDataDb = await updatePairDayData(event) as PairDayDataDb;
  let pairHourData: PairHourDataDb = await updatePairHourData(event) as PairHourDataDb;
  let stableswapDayData: StableswapDayDataDb = await updateFactoryDayData(event) as StableswapDayDataDb;
  let token0DayData: TokenDayDataDb = await updateTokenDayData(token0, event) as TokenDayDataDb;
  let token1DayData: TokenDayDataDb = await updateTokenDayData(token1, event) as TokenDayDataDb;

  // swap specific updating
  // console.log(stableswapDayData)
  stableswapDayData.dailyVolumeUSD =
    convertToDecimal(stableswapDayData.dailyVolumeUSD).plus(trackedAmountUSD);
  stableswapDayData.dailyVolumeCANTO =
    convertToDecimal(stableswapDayData.dailyVolumeCANTO).plus(trackedAmountCANTO);
  stableswapDayData.dailyVolumeUntracked =
    convertToDecimal(stableswapDayData.dailyVolumeUntracked).plus(derivedAmountUSD);
  await new StableswapDayDataModel(stableswapDayData).save();

  // swap specific updating for pair
  pairDayData.dailyVolumeToken0 =
    convertToDecimal(pairDayData.dailyVolumeToken0).plus(amount0Total);
  pairDayData.dailyVolumeToken1 =
    convertToDecimal(pairDayData.dailyVolumeToken1).plus(amount1Total);
  pairDayData.dailyVolumeUSD =
    convertToDecimal(pairDayData.dailyVolumeUSD).plus(trackedAmountUSD);
  await new PairDayDataModel(pairDayData).save();

  // update hourly pair data
  pairHourData.hourlyVolumeToken0 =
    convertToDecimal(pairHourData.hourlyVolumeToken0).plus(amount0Total);
  pairHourData.hourlyVolumeToken1 =
    convertToDecimal(pairHourData.hourlyVolumeToken1).plus(amount1Total);
  pairHourData.hourlyVolumeUSD =
    convertToDecimal(pairHourData.hourlyVolumeUSD).plus(trackedAmountUSD);
  await new PairHourDataModel(pairHourData).save();

  // swap specific updating for token0
  token0DayData.dailyVolumeToken =
    convertToDecimal(token0DayData.dailyVolumeToken).plus(amount0Total);
  token0DayData.dailyVolumeCANTO = convertToDecimal(token0DayData.dailyVolumeCANTO).plus(
    amount0Total.times(convertToDecimal(token0.derivedCANTO))
  );
  token0DayData.dailyVolumeUSD = convertToDecimal(token0DayData.dailyVolumeUSD).plus(
    amount0Total.times(convertToDecimal(token0.derivedCANTO)).times(convertToDecimal(bundle.cantoPrice))
    // amount0Total.times(convertToDecimal(token0.derivedCANTO))
  );
  await new TokenDayDataModel(token0DayData).save();

  // swap specific updating
  token1DayData.dailyVolumeToken =
    convertToDecimal(token1DayData.dailyVolumeToken).plus(amount1Total);
  token1DayData.dailyVolumeCANTO = convertToDecimal(token1DayData.dailyVolumeCANTO).plus(
    amount1Total.times(convertToDecimal(token1.derivedCANTO))
  );
  token1DayData.dailyVolumeUSD = convertToDecimal(token1DayData.dailyVolumeUSD).plus(
    amount1Total.times(convertToDecimal(token1.derivedCANTO)).times(convertToDecimal(bundle.cantoPrice))
    // amount1Total.times(convertToDecimal(token1.derivedCANTO))
  );
  await new TokenDayDataModel(token1DayData).save();
}

export async function transferEventHandler(
  event: EventData,
  input: TransferEventInput
) {
  const FACTORY_ADDRESS = Config.contracts.baseV1Factory.addresses[0];
  const timestamp: any = await getTimestamp(event.blockNumber);
  const txHash: string = event.transactionHash;

  // ignore inital transfers for first adds
  if (input.to == ADDRESS_ZERO && convertToDecimal(input.amount).equals(new Decimal(1000))) {
    return;
  }

  // service
  const factoryService = Container.get(StableswapFactoryService);
  const pairService = Container.get(PairService);
  const tokenService = Container.get(TokenService);
  const bundleService = Container.get(BundleService);
  const transactionService = Container.get(TransactionService);
  const burnService = Container.get(BurnService);
  const mintService = Container.get(MintService);

  // load
  let factory: StableswapFactoryDb = await factoryService.getByAddress(FACTORY_ADDRESS) as StableswapFactoryDb;

  // user stats
  const from = input.from;
  const to = input.to;
  await createUser(input.from);
  await createUser(input.to);

  // get pair and load
  let pair: PairDb = await pairService.getByAddress(event.address) as PairDb;
  let pairContract: any = await new web3.eth.Contract(BaseV1PairABI, event.address);

  // liquidity token amount being transferred
  let value: Decimal = convertTokenToDecimal(input.amount, BI_18);

  // load transaction
  let transaction: TransactionDb = await transactionService.getByHash(txHash) as TransactionDb;
  if (transaction === null) {
    transaction = new TransactionDb(txHash);
    transaction.blockNumber = new Decimal(event.blockNumber);
    transaction.timestamp = timestamp;
    await new TransactionModel(transaction).save();
  }

  // mints
  let mints = transaction.mints;
  if (from == ADDRESS_ZERO) {
    // update total supply
    pair.totalSupply = value.plus(new Decimal(pair.totalSupply.toString()));
    await new PairModel(pair).save();

    // create new mint if no mints so far OR if last one completed
    if (mints.length === 0 || (await isCompleteMint(mints[mints.length - 1]))) {
      const mintId = txHash
        .concat("-")
        .concat(new Decimal(mints.length).toString());
      let mint = new MintDb(mintId);
      mint.transaction = transaction.id;
      mint.pair = pair.id;
      mint.to = to;
      mint.liquidity = value;
      mint.timestamp = transaction.timestamp;

      // await mint.save();
      await new MintModel(mint).save();

      // update mints in transaction
      transaction.mints = mints.concat([mint.id]);

      // save entities
      await new TransactionModel(transaction).save();
      await new StableswapFactoryModel(factory).save();
    }
  }

  // case: direct send first on CANTO withdrawls
  if (to == pair.id) {
    let burns = transaction.burns;

    const burnId = txHash
      .concat("-")
      .concat(new Decimal(burns.length).toString());
    let burn = new BurnDb(burnId);
    burn.transaction = transaction.id;
    burn.pair = pair.id;
    burn.liquidity = value;
    burn.timestamp = transaction.timestamp;
    burn.to = to;
    burn.sender = from;
    burn.needsComplete = true;

    // await burn.save();
    await new BurnModel(burn).save();

    transaction.burns = burns.concat([burn.id]);
    await new TransactionModel(transaction).save();
  }

  // burn
  if (to == ADDRESS_ZERO && from == pair.id) {
    // update pair total supply
    pair.totalSupply = new Decimal(pair.totalSupply.toString()).minus(value);
    await new PairModel(pair).save();

    // new instance of logical burn
    let burns = transaction.burns;
    let burn = new BurnDb("");
    if (burns.length > 0) {
      const currentBurn = await burnService.getById(burns[burns.length - 1]);
      if (currentBurn === null) {
        return;
      }
      if (currentBurn.needsComplete) {
        burn = currentBurn as BurnDb;
      } else {
        const burnId = txHash
          .concat("-")
          .concat(new Decimal(burns.length).toString());
        burn = new BurnDb(burnId);
        burn.transaction = transaction.id;
        burn.pair = pair.id;
        burn.liquidity = value;
        burn.timestamp = transaction.timestamp;
        burn.needsComplete = false;
      }
    } else {
      const burnId = txHash
        .concat("-")
        .concat(new Decimal(burns.length).toString());
      burn = new BurnDb(burnId);
      burn.transaction = transaction.id;
      burn.pair = pair.id;
      burn.liquidity = value;
      burn.timestamp = transaction.timestamp;
      burn.needsComplete = false;
    }

    // if this logical burn included a fee mint, account for this
    if (
      mints.length !== 0 &&
      !(await isCompleteMint(mints[mints.length - 1]))
    ) {
      let mint: any = await mintService.getById(mints[mints.length - 1]);
      burn.feeTo = mint.to;
      burn.feeLiquidity = mint.liquidity;

      // remove logical mint
      await mintService.deleteById(mints[mints.length - 1]);

      mints.pop();
      transaction.mints = mints;
      await new TransactionModel(transaction).save();
    }
    await new BurnModel(burn).save();

    if (burn.needsComplete) {
      burns[burns.length - 1] = burn.id;
    } else {
      // add new one
      burns.push(burn.id);
    }
    transaction.burns = burns;
    await new TransactionModel(transaction).save();
  }

  if (from != ADDRESS_ZERO && from != pair.id) {
    let fromUserLiquidityPosition = await createLiquidityPosition(
      event.address,
      from
    );
    fromUserLiquidityPosition.liquidityTokenBalance = convertTokenToDecimal(
      await pairContract.methods.balanceOf(from).call(),
      BI_18
    );
    await new LiquidityPositionModel(fromUserLiquidityPosition).save();
    await createLiquiditySnapshot(fromUserLiquidityPosition, event);
  }

  if (to != ADDRESS_ZERO && to != pair.id) {
    let toUserLiquidityPosition = await createLiquidityPosition(
      event.address,
      to
    );
    toUserLiquidityPosition.liquidityTokenBalance = convertTokenToDecimal(
      await pairContract.methods.balanceOf(to).call(),
      BI_18
    );
    await new LiquidityPositionModel(toUserLiquidityPosition).save();
    await createLiquiditySnapshot(toUserLiquidityPosition, event);
  }

  await new TransactionModel(transaction).save();
}

export async function syncEventHandler(
  event: EventData,
  input: SyncEventInput
) {
  //
  const factoryService = Container.get(StableswapFactoryService);
  const pairService = Container.get(PairService);
  const tokenService = Container.get(TokenService);
  const bundleService = Container.get(BundleService);

  // service functions
  const FACTORY_ADDRESS = Config.contracts.baseV1Factory.addresses[0];
  let factory: StableswapFactoryDb = await factoryService.getByAddress(FACTORY_ADDRESS) as StableswapFactoryDb;
  let pair: PairDb = await pairService.getByAddress(event.address) as PairDb;
  let token0: TokenDb = await tokenService.getByAddress(pair.token0) as TokenDb;
  let token1: TokenDb = await tokenService.getByAddress(pair.token1) as TokenDb;

  // reset factory liquiuty by subtracting only tracked liquidity
  factory.totalLiquidityCANTO = convertToDecimal(factory.totalLiquidityCANTO).minus(
    convertToDecimal(pair.trackedReserveCANTO)
  );

  // reset token total liquidity amount
  token0.totalLiquidity = convertToDecimal(token0.totalLiquidity).minus(convertToDecimal(pair.reserve0));
  token1.totalLiquidity = convertToDecimal(token1.totalLiquidity).minus(convertToDecimal(pair.reserve1));

  pair.reserve0 = convertTokenToDecimal(input.reserve0, token0.decimals);
  pair.reserve1 = convertTokenToDecimal(input.reserve1, token1.decimals);

  if (!convertToDecimal(pair.reserve1).equals(ZERO_BD)) {
    pair.token0Price = convertToDecimal(pair.reserve0).div(convertToDecimal(pair.reserve1));
  } else {
    pair.token0Price = ZERO_BD;
  }

  if (!convertToDecimal(pair.reserve0).equals(ZERO_BD)) {
    pair.token1Price = convertToDecimal(pair.reserve1).div(convertToDecimal(pair.reserve0));
  } else {
    pair.token1Price = ZERO_BD;
  }
  await new PairModel(pair).save();

  // update CANTO price now that reserves could have changed
  let bundle: BundleDb = await bundleService.get() as BundleDb;
  bundle.cantoPrice = await getCantoPriceInUSD();
  await new BundleModel(bundle).save();

  // update derived CANTO values
  token0.derivedCANTO = await findCantoPerToken(token0);
  token1.derivedCANTO = await findCantoPerToken(token1);
  await new TokenModel(token0).save();
  await new TokenModel(token1).save();

  // get tracked liquidity - will be 0 if neither in whitelist
  let trackedLiquidityCANTO: Decimal;
  if (!convertToDecimal(bundle.cantoPrice).equals(ZERO_BD)) {
    let trackedLiquidityUSD = await getTrackedLiquidityUSD(
      pair.reserve0,
      token0,
      pair.reserve1,
      token1
    );
    trackedLiquidityCANTO = convertToDecimal(trackedLiquidityUSD).div(convertToDecimal(bundle.cantoPrice));
    // trackedLiquidityCANTO = convertToDecimal(trackedLiquidityUSD);
  } else {
    trackedLiquidityCANTO = ZERO_BD;
  }

  // use derived amounts within pair
  pair.trackedReserveCANTO = trackedLiquidityCANTO;
  pair.reserveCANTO = convertToDecimal(pair.reserve0)
    .times(convertToDecimal(token0.derivedCANTO))
    .plus(convertToDecimal(convertToDecimal(pair.reserve1).times(convertToDecimal(token1.derivedCANTO))));
  pair.reserveUSD = convertToDecimal(pair.reserveCANTO).times(convertToDecimal(bundle.cantoPrice));
  // pair.reserveUSD = convertToDecimal(pair.reserveCANTO);

  // use tracked amounts globally
  factory.totalLiquidityCANTO =
    convertToDecimal(factory.totalLiquidityCANTO).plus(convertToDecimal(trackedLiquidityCANTO));
  factory.totalLiquidityUSD = convertToDecimal(factory.totalLiquidityCANTO).times(convertToDecimal(bundle.cantoPrice));
  // factory.totalLiquidityUSD = convertToDecimal(factory.totalLiquidityCANTO);
  // todo: since just multiplication can try to not use USD if all calc based on CANTO

  // correctly set liquidity amounts for each token
  token0.totalLiquidity = convertToDecimal(token0.totalLiquidity).plus(convertToDecimal(pair.reserve0));
  token1.totalLiquidity = convertToDecimal(token1.totalLiquidity).plus(convertToDecimal(pair.reserve1));

  // save
  await new BundleModel(bundle).save();
  await new PairModel(pair).save();
  await new StableswapFactoryModel(factory).save();
  await new TokenModel(token0).save();
  await new TokenModel(token1).save();
}

async function isCompleteMint(mintId: string): Promise<boolean> {
  let mint: any = await MintModel.findOne({ id: mintId }).exec();
  return mint.sender != null || mint.sender !== "";
  // return Mint.load(mintId).sender !== null; // todo
}
