import { Log } from "web3-core";
import { Contract, EventData } from "web3-eth-contract";
import { Config } from "../config";
import { web3 } from "../loaders/web3";
import { StableswapDayData } from "../models/stableswapDayData";
import { pairCreatedEventHandler } from "../services/eventHandlers/baseV1Factory";
import { PairCreatedEventInput } from "../types/event/baseV1Factory";
import {
  BaseV1FactoryABI,
  PairCreated,
  PairCreatedEventAbiInputs,
} from "../utils/abiParser/baseV1factory";

export async function baseV1FactoryIndexHistoricalEvents(
  latestBlockNumber: number
) {
  console.log("BaseV1Factory");
  const iter = Math.floor(latestBlockNumber / 10_000);
  // console.log(iter);
  const t = await web3.eth.getProtocolVersion();
  console.log(t);
  const FACTORY_ADDRESS = Config.contracts.baseV1Factory.addresses[0];
  const stableswapFactory = new web3.eth.Contract(
    BaseV1FactoryABI,
    FACTORY_ADDRESS
  );
  for (var i = 0; i < iter; i++) {
    // PairCreated
    await pairCreatedRangeEventHandler(stableswapFactory, i);
  }
  // web3.eth.clearSubscriptions(); // todo
}

async function pairCreatedRangeEventHandler(contract: Contract, start: number) {
  const range = Config.canto.rpcBlockRange;
  const options = {
    fromBlock: start * range,
    toBlock: (start + 1) * range,
    // address: Config.contracts.baseV1Factory.addresses,
    topics: Config.contracts.baseV1Factory.events.options.signatures,
  };

  async function processorServiceFunction(events: EventData[]) {
    for (let event of events) {
      const decodedLog = web3.eth.abi.decodeLog(
        PairCreatedEventAbiInputs,
        event.raw.data,
        event.raw.topics.slice(1)
      );
      console.log(`New PairCreated!`, event.blockNumber);
      const input = new PairCreatedEventInput(event.returnValues);
      await pairCreatedEventHandler(event, input);
    }
  }

  await contract
    .getPastEvents(PairCreated, options)
    .then(async (events) => await processorServiceFunction(events));
}
