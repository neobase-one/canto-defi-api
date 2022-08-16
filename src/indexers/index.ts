import { Config } from "../config";
import { web3 } from "../loaders/web3";
import { IndexDb, IndexModel } from "../models/dex";
import { baseV1FactoryIndexHistoricalEvents, indexFactoryEvents } from "./dex/factoryIndexer";
import { baseV1PairIndexHistoricalEvents, indexPairEvents } from "./dex/pairIndexer";
import { blockIndexHistorical, indexBlocks } from "./dex/blockIndexer";
import { indexComptollerEvents } from "./lending/comptollerIndexer";
import { indexcTokenEvents } from "./lending/ctokenIndexer";

export async function indexHistoricalEvents(latestBlockNumber: number) {
  // Block
  blockIndexHistorical(latestBlockNumber);

  // BaseV1Factory
  await baseV1FactoryIndexHistoricalEvents(latestBlockNumber);

  // BaseV1Pair
  await baseV1PairIndexHistoricalEvents(latestBlockNumber);
}

export async function initSubscribers() { };


export async function indexChain() {
  while (1) {
    // db.Employees.find({}).sort({"Emp salary":-1}).limit(1)
    let indexDb: any = await IndexModel.find({})
      .sort({ lastBlockNumber: "desc" })
      .limit(1).exec(); // returns list

    if (indexDb.length !== 0) {
      indexDb = indexDb[0];
    } else {
      // first time starting indexer
      const START_BLOCK = Config.indexer.startBlock;
      indexDb = new IndexDb(START_BLOCK);
    }

    let latestIndexedBlockHead = indexDb.lastBlockNumber;
    let chainBlockHead = await web3.eth.getBlockNumber();
    const MAX_RANGE = Config.canto.rpcBlockRange;
    let range = Math.min(Math.max(0, chainBlockHead - latestIndexedBlockHead), MAX_RANGE)
    console.log("LAST_INDEXED", latestIndexedBlockHead, "CHAIN_HEAD", chainBlockHead, "MAX_RANGE", MAX_RANGE, "RANGE", range)

    //
    let start = latestIndexedBlockHead;
    let end = latestIndexedBlockHead + range;

    // index
    indexBlocks(start, end);

    // DEX
    // BaseV1Factory
    await indexFactoryEvents(start, end);

    // BaseV1Pair
    await indexPairEvents(start, end);

    // Lending
    // Comptroller
    await indexComptollerEvents(start, end);

    // cToken
    await indexcTokenEvents(start, end);


    // update last indexed block
    indexDb.lastBlockNumber = end;
    await new IndexModel(indexDb).save();
  }
}
