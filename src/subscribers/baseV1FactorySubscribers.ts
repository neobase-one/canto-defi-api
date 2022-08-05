import { Log } from "web3-core";
import { Config } from "../config";
import { web3 } from "../loaders/web3";
import { PairCreatedEventAbiInputs } from "../utils/abiParser/baseV1factory";

async function pairCreatedLogs() {
  console.log("enter")
  web3.eth.getProtocolVersion().then(console.log);

  const PairCreatedOptions = {
    fromBlock: 0,
    toBlock: 10000,
    address: Config.contracts.baseV1Factory.address,
    // topics: [Config.contracts.baseV1Factory.events.pairCreated.signature],
  };

  function processorServiceFunction(error: Error, result: Log) {
    if (!error) {
      const eventObj = web3.eth.abi.decodeLog(
        PairCreatedEventAbiInputs,
        result.data,
        result.topics.slice(1)
      );
      console.log(`New PairCreated!`, result.blockNumber);
    } else {
      console.log(error);
    }
  }

  web3.eth.subscribe("logs", PairCreatedOptions, (err, res) =>
    processorServiceFunction(err, res)
  );
}

export const PairCreatedLogSubscriber = pairCreatedLogs;
