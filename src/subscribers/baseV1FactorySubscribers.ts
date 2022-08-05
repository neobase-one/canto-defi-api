import { Log } from "web3-core";
import { Config } from "../config";
import { web3 } from "../loaders/web3";
import { pairCreatedEventHandler } from "../services/eventHandlers/baseV1Factory";
import { PairCreatedInput } from "../types/event/PairCreatedEvent";
import { PairCreatedEventAbiInputs } from "../utils/abiParser/baseV1factory";

export async function baseV1FactoryIndexHistoricalEvents(
  latestBlockNumber: number
) {
  console.log("BaseV1Factory");
  const iter = Math.floor(latestBlockNumber / 10_000);
  // console.log(iter);
  for(var i=0; i<iter; i++) {
    // PairCreated
    pairCreatedRangeEventHandler(i);
  }
  // web3.eth.clearSubscriptions(); // todo
};

async function pairCreatedRangeEventHandler(start: number) {
  const range = Config.canto.rpcBlockRange;
  const options = {
    fromBlock: start * range,
    toBlock: (start + 1) * range,
    address: Config.contracts.baseV1Factory.addresses,
    topics: Config.contracts.baseV1Factory.events.options.signatures,
  };

  function processorServiceFunction(error: Error, log: Log) {
    if (!error) {
      const eventObj = web3.eth.abi.decodeLog(
        PairCreatedEventAbiInputs,
        log.data,
        log.topics.slice(1)
      );
      const input = new PairCreatedInput(eventObj);
      // console.log("Class", input)
      console.log(`New PairCreated!`, log.blockNumber, eventObj);
      pairCreatedEventHandler(log, input);
    } else {
      console.log(error);
    }
  }

  web3.eth.subscribe("logs", options, (err, res) =>
    processorServiceFunction(err, res)
  );
}
