import { Config } from "../../config";
import { web3 } from "../../loaders/web3";
import { BlockDb, BlockModel } from "../../models/dex/block";

export async function blockIndexHistorical(latestBlockNumber: number) {
  console.log("Blocks");
  const iter = Math.floor(latestBlockNumber / 10_000);
  // console.log(iter);
  const t = await web3.eth.getProtocolVersion();
  console.log(t);

  for (var i = iter; i >= 0; i--) {
    blockEventHandler(i);
  }
}

async function blockEventHandler(iter: number) {
  const range = Config.canto.rpcBlockRange;
  const end = iter * range;
  const start = (iter - 1) * range;

  // sync
  // for (var i = start; i < end; i++) {
  //   const block = await web3.eth.getBlock(i, false);

  //   let blockDb = new BlockDb(block.hash);
  //   blockDb.number = i;
  //   blockDb.timestamp = block.timestamp as number;

  //   await new BlockModel(blockDb).save();
  // }

  // async
  for (var i = start; i < end; i++) {
    web3.eth.getBlock(i, false)
      .then(saveBlock)
  }

  async function saveBlock(block: any) {
    let blockDb = new BlockDb(block.hash);
    blockDb.number = block.number;
    blockDb.timestamp = block.timestamp as number;

    new BlockModel(blockDb).save();
  }
}

// UPGRADE
export async function indexBlocks(start: number, end: number) {
  console.log("Block", start, end);

  // async
  for (var i = start; i < end; i++) {
    web3.eth.getBlock(i, false)
      .then(saveBlock)
  }

  async function saveBlock(block: any) {
    let blockDb = new BlockDb(block.hash);
    blockDb.number = block.number;
    blockDb.timestamp = block.timestamp as number;

    let updateDoc: any = { id: block.hash, number: block.number, timestamp: block.timestamp }
    BlockModel.updateOne({ number: block.number }, updateDoc, { upsert: true }).exec();
  }
}
