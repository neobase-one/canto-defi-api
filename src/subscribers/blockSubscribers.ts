import { Config } from "../config";
import { web3 } from "../loaders/web3";
import { BlockDb, BlockModel } from "../models/block";

export async function blockIndexHistorical(latestBlockNumber: number) {
  console.log("Blocks");
  const iter = Math.floor(latestBlockNumber / 10_000);
  // console.log(iter);
  const t = await web3.eth.getProtocolVersion();
  console.log(t);

  for (var i = 0; i < iter; i++) {
    await blockEventHandler(i);
  }
}

async function blockEventHandler(iter: number) {
  const range = Config.canto.rpcBlockRange;
  const start = iter * range;
  const end = (iter + 1) * range;

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

    await new BlockModel(blockDb).save();
  }
}
