import Decimal from "decimal.js";
import Container from "typedi";
import { Log } from "web3-core";
import { EventData } from "web3-eth-contract";
import { Config } from "../../config";
import { Burn, BurnModel } from "../../models/burn";
import { LiquidityPosition } from "../../models/liquidityPosition";
import { Mint, MintModel } from "../../models/mint";
import { Pair, PairModel } from "../../models/pair";
import {
  StableswapFactory,
  StableswapFactoryModel,
} from "../../models/stableswapFactory";
import { Token, TokenModel } from "../../models/token";
import { Transaction } from "../../models/transaction";
import {
  BurnEventInput,
  MintEventInput,
  SwapEventInput,
  SyncEventInput,
  TransferEventInput,
} from "../../types/event/baseV1Pair";
import { MintEventSignature } from "../../utils/abiParser/baseV1Pair";
import { ADDRESS_ZERO, BI_18, ONE_BD, ZERO_BD } from "../../utils/constants";
import { BundleService } from "./models/bundle";
import { BurnService } from "./models/burn";
import { MintService } from "./models/mint";
import { PairService } from "./models/pair";
import { StableswapFactoryService } from "./models/stableswapFactory";
import { TokenService } from "./models/token";
import { TransactionService } from "./models/transaction";

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
  let factory: any = await factoryService.getByAddress(FACTORY_ADDRESS);
  let transaction: any = await transactionService.getByHash(txHash);
  let pair: any = await pairService.getByAddress(event.address);
  let token0: any = await tokenService.getByAddress(pair.token0);
  let token1: any = await tokenService.getByAddress(pair.token1);

  let mints = transaction.mints;
  let mint: any = await mintService.getById(mints[mints.length - 1]);

  // update exchange info (excpet balances, sync will cover that)
  let token0Amount = converTokenToDecimal(input.amount0, token0.decimal);
  let token1Amount = converTokenToDecimal(input.amount1, token1.decimal);

  // update txn counts
  token0.txCount = token0.txCount.plus(ONE_BD);
  token1.txCount = token1.txCount.plus(ONE_BD);

  // get new amount of USD and ETH for tracking
  let bundle: any = await bundleService.get();
  let amountTotalETH = token1.derivedETH
    .times(token1Amount)
    .plus(token0.derivedETH.times(token0Amount));
  let amountTotalUSD = amountTotalETH.times(bundle.ethPrice);

  // update txn counts
  pair.txCount = pair.txCount.plus(ONE_BD);
  factory.txCount = factory.txCount.plus(ONE_BD);

  // save entities
  await token0.save();
  await token1.save();
  await pair.save();
  await factory.save();

  // update mint
  mint.sender = input.sender;
  mint.amount0 = token0Amount;
  mint.amount1 = token1Amount;
  mint.logIndex = new Decimal(event.logIndex);
  mint.amountUSD = amountTotalUSD; // todo: add amountTotalETH
  await mint.save();

  // update LP position
  let liquidityPosition = createLiquidityPosition(event.address, mint.to);
  createLiquiditySnapshot(liquidityPosition, event);

  // update day metric objects
  updatePairDayData(event);
  updatePairHourData(event);
  updateFactoryDatData(event);
  updateTokenDayData(token0, event);
  updateTokenDayData(token1, event);
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
  let factory: any = await factoryService.getByAddress(FACTORY_ADDRESS);
  let transaction: any = await transactionService.getByHash(txHash);
  if (transaction === null) {
    return;
  }
  let pair: any = await pairService.getByAddress(event.address);
  let token0: any = await tokenService.getByAddress(pair.token0);
  let token1: any = await tokenService.getByAddress(pair.token1);

  // burns
  let burns = transaction.burns;
  let burn: any = await burnService.getById(burns[burns.length - 1]);

  // update token info
  let token0Amount = convertTokenToDecimal(input.amount0, token0.decimals)
  let token1Amount = convertTokenToDecimal(input.amount1, token1.decimals)

  // update txn counts
  token0.txCount = token0.txCount.plus(ONE_BD)
  token1.txCount = token1.txCount.plus(ONE_BD)

  // get new amount of USD and ETH for tracking
  let bundle: any = await bundleService.get();
  let amountTotalETH = token1.derivedETH
    .times(token1Amount)
    .plus(token0.derivedETH.times(token0Amount));
  let amountTotalUSD = amountTotalETH.times(bundle.ethPrice);

  // update txn counts
  pair.txCount = pair.txCount.plus(ONE_BD);
  factory.txCount = factory.txCount.plus(ONE_BD);

  // save entities
  await token0.save();
  await token1.save();
  await pair.save();
  await factory.save();

  // update burn
  burn.amount0 = token0Amount;
  burn.amount1 = token1Amount;
  burn.logIndex = new Decimal(event.logIndex);
  burn.amountUSD = amountTotalUSD; // todo: add amountTotalETH field
  await burn.save();


  // update LP position
  let liquidityPosition = createLiquidityPosition(event.address, burn.sender);
  createLiquiditySnapshot(liquidityPosition, event);

  // update day metric objects
  updatePairDayData(event);
  updatePairHourData(event);
  updateFactoryDatData(event);
  updateTokenDayData(token0, event);
  updateTokenDayData(token1, event);
}

export async function swapEventHandler(
  event: EventData,
  input: SwapEventInput
) {}

export async function transferEventHandler(
  event: EventData,
  input: TransferEventInput
) {
  const FACTORY_ADDRESS = Config.contracts.baseV1Factory.addresses[0];

  // ignore inital transfers for first adds
  if (input.to == ADDRESS_ZERO && input.amount.equals(new Decimal(1000))) {
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
  let factory: any = await factoryService.getByAddress(FACTORY_ADDRESS);

  // user stats
  const from = input.from;
  const to = input.to;
  // todo: createUser
  // createUser(input.from);
  // createUser(input.to);

  // get pair and load
  let pair: any = await pairService.getByAddress(event.address);
  let pairContract = PairContract.bind(event.address); //todo:what does PairContract do

  // liquidity token amount being transferred
  let value = convertTokenToDecimal(input.amount, BI_18); //todo: convertTokenToDecimal

  // load transaction
  const txHash = event.transactionHash;
  let transaction: any = await transactionService.getByHash(txHash);
  if (transaction === null) {
    transaction = new Transaction(event.transactionHash);
    transaction.blockNumber = new Decimal(event.blockNumber);
    transaction.timestamp = ZERO_BD; // todo: can this be removed?
  }

  // mints
  let mints = transaction.mints;
  if (from == ADDRESS_ZERO) {
    // update total supply
    pair.totalSupply = pair.totalSupply.plus(value);
    await pair.save();

    // create new mint if no mints so far OR if last one completed
    if (mints.length === 0 || (await isCompleteMint(mints[mints.length - 1]))) {
      const mintId = txHash
        .concat("-")
        .concat(new Decimal(mints.length).toString());
      let mint = new Mint(mintId);
      mint.transaction = transaction.id;
      mint.pair = pair.id;
      mint.to = to;
      mint.liquidity = value;
      mint.timestamp = ZERO_BD; // todo: can this be removed?

      // await mint.save(); // todo: model
      await new MintModel(mint).save();


      // update mints in transaction
      transaction.mints = mints.concat([mint.id]);

      // save entities
      await transaction.save();
      await factory.save();
    }
  }

  // case: direct send first on ETH withdrawls
  if (to == pair.id) {
    let burns = transaction.burns;

    const burnId = txHash
      .concat("-")
      .concat(new Decimal(burns.length).toString());
    let burn = new Burn(burnId);
    burn.transaction = transaction.id;
    burn.pair = pair.id;
    burn.liquidity = value;
    burn.timestamp = ZERO_BD; // todo: removed?
    burn.to = to;
    burn.sender = from;
    burn.needsComplete = true;

    // await burn.save(); // todo: model
    await new BurnModel(burn).save();

    transaction.burns = burns.concat([burn.id]);
    await transaction.save();
  }

  // burn
  if (to == ADDRESS_ZERO && from == pair.id) {
    // update pair total supply
    pair.totalSupply = pair.totalSupply.minus(value);
    await pair.save();

    // new instance of logical burn
    let burns = transaction.burns;
    let burn: Burn;
    if (burns.length > 0) {
      const currentBurn = await burnService.getById(burns[burns.length - 1]);
      if (currentBurn?.needsComplete) {
        burn = currentBurn as Burn;
      } else {
        const burnId = txHash
          .concat("-")
          .concat(new Decimal(burns.length).toString());
        burn = new Burn(burnId);
        burn.transaction = transaction.id;
        burn.pair = pair.id;
        burn.liquidity = value;
        burn.timestamp = ZERO_BD; // todo: remove?
        burn.needsComplete = false;
      }
    } else {
      const burnId = txHash
        .concat("-")
        .concat(new Decimal(burns.length).toString());
      burn = new Burn(burnId);
      burn.transaction = transaction.id;
      burn.pair = pair.id;
      burn.liquidity = value;
      burn.timestamp = ZERO_BD; // todo: remove?
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
      await transaction.save();
    }
    await new BurnModel(burn).save();

    if (burn.needsComplete) {
      burns[burns.length - 1] = burn.id;
    } else {
      // add new one
      burns.push(burn.id);
    }
    transaction.burns = burns;
    await transaction.save();
  }

  if (from != ADDRESS_ZERO && from != pair.id) {
    let fromUserLiquidityPosition = createLiquidutyPosition(
      event.address,
      from
    ); // todo
    fromUserLiquidityPosition.liquidityTokenBalance = convertTokenToDecimal(
      pairContract.balanceOf(from),
      BI_18
    ); // todo
    await fromUserLiquidityPosition.save();
    createLiquiditySnapshot(fromUserLiquidityPosition, event);
  }

  if (to != ADDRESS_ZERO && to != pair.id) {
    let toUserLiquidityPosition = createLiquidutyPosition(event.address, to); // todo
    toUserLiquidityPosition.liquidityTokenBalance = convertTokenToDecimal(
      pairContract.balanceOf(to),
      BI_18
    ); // todo
    await toUserLiquidityPosition.save();
    createLiquiditySnapshot(toUserLiquidityPosition, event);
  }

  await transaction.save();
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
  let factory: any = await factoryService.getByAddress(FACTORY_ADDRESS);
  let pair: any = await pairService.getByAddress(event.address);
  let token0: any = await tokenService.getByAddress(pair.token0);
  let token1: any = await tokenService.getByAddress(pair.token1);

  // reset factory liquiuty by subtracting only tracked liquidity
  factory.totalLiquidityETH = factory.totalLiquidityETH.minus(
    pair.trackedReserveETH
  );

  // reset token total liquidity amount
  token0.totalLiquidity = token0.totalLiquidity.minus(pair.reserve0);
  token1.totalLiquidity = token1.totalLiquidity.minus(pair.reserve1);

  // todo: convertTokenToDecimal
  pair.reserve0 = ZERO_BD;
  pair.reserve1 = ZERO_BD;

  if (!pair.reserve1.equals(ZERO_BD)) {
    pair.token0Price = pair.reserve0.div(pair.reserve1);
  } else {
    pair.token0Price = ZERO_BD;
  }

  if (!pair.reserve0.equals(ZERO_BD)) {
    pair.token1Price = pair.reserve1.div(pair.reserve0);
  } else {
    pair.token1Price = ZERO_BD;
  }
  await pair.save();

  // update ETH price now that reserves could have changed
  let bundle: any = await bundleService.get();
  bundle.ethPrice = ZERO_BD; // todo: getEthPriceInUSD
  await bundle.save();

  // update derived ETH values
  // todo: findEthPerToken
  token0.derivedETH = ZERO_BD;
  token1.derivedETH = ZERO_BD;
  await token0.save();
  await token1.save();

  // get tracked liquidity - will be 0 if neither in whitelist
  let trackedLiquidityETH: Decimal;
  if (!bundle.ethPrice.equals(ZERO_BD)) {
    // todo: getTrackedLiquidityUSD
    trackedLiquidityETH = ZERO_BD;
  } else {
    trackedLiquidityETH = ZERO_BD;
  }

  // use derived amounts within pair
  pair.trackedReserveETH = trackedLiquidityETH;
  pair.reserveETH = pair.reserve0
    .times(token0.derivedAmountETH)
    .plus(pair.reserve1.times(token1.derivedETH));
  pair.reserveUSD = pair.reserveETH.times(bundle.ethPrice);

  // use tracked amounts globally
  factory.totalLiquidityETH =
    factory.totalLiquidityETH.plus(trackedLiquidityETH);
  factory.totalLiquidityUSD = factory.totalLiquidityETH.times(bundle.ethPrice);
  // todo: since just multiplication can try to not use USD if all calc based on ETH

  // correctly set liquidity amounts for each token
  token0.totalLiquidity = token0.totalLiquidity.plus(pair.reserve0);
  token1.totalLiquidity = token1.totalLiquidity.plus(pair.reserve1);

  // save
  await bundle.save();
  await pair.save();
  await factory.save();
  await token0.save();
  await token1.save();
}

async function isCompleteMint(mintId: string): Promise<boolean> {
  let mint: any = await MintModel.findOne({ id: mintId }).exec();
  return (await mint.sender) != null;
  // return Mint.load(mintId).sender !== null; // todo
}
