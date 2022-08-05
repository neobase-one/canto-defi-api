import { Log } from "web3-core";
import { Config } from "../config";
import { web3 } from "../loaders/web3";
import { BaseV1PairABI, MintEventAbiInputs } from "../utils/abiParser/baseV1Pair";


function MintEventSubs() {
  console.log("MINT")
  web3.eth.getProtocolVersion().then(console.log);

  const MintOptions = {
    fromBlock: 190000,
    toBlock: 200000,
    // fromBlock: 0,
    // toBlock: 10000,
    address: Config.contracts.baseV1Pair.addresses,
    topics: [web3.utils.keccak256("Mint(address,uint256,uint256)")],
  };

  function processorServiceFunction(error: Error, result: Log) {
    if (!error) {
      // console.log("RAW")
      // console.log(result);
      // console.log("DECODE");
      const eventObj = web3.eth.abi.decodeLog(
        MintEventAbiInputs,
        result.data,
        result.topics.slice(1)
      );
      console.log(`New Mint!`, result.blockNumber, result.address);
    } else {
      console.log(error);
    }
  }

  const address = "0xE1764f6e5Cc49b3852DAE3801aDD1ADeb616B2b6"; // CantoNoteLP
  const contract = new web3.eth.Contract(BaseV1PairABI, address);
  web3.eth.subscribe("logs", MintOptions, (err, res) =>
    processorServiceFunction(err, res)
  );
  console.log("done");
}

export const MintSubscriber = MintEventSubs;

export async function baseV1PairIndexHistoricalEvents(
  latestBlockNumber: number
) {
  console.log("BaseV1Pair");

}