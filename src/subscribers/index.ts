import { Config } from "../config";
import { web3 } from "../loaders/web3";
import { IndexModel } from "../models";
import { baseV1FactoryIndexHistoricalEvents, indexFactoryEvents } from "./baseV1FactorySubscribers";
import { baseV1PairIndexHistoricalEvents, indexPairEvents } from "./baseV1PairSubscribers";
import { blockIndexHistorical, indexBlocks } from "./blockSubscribers";

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

    indexDb = indexDb[0];

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

    await indexFactoryEvents(start, end);

    await indexPairEvents(start, end);

    // update last indexed block
    indexDb.lastBlockNumber = end;
    await new IndexModel(indexDb).save();
  }
}
