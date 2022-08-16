import { collectFields } from "graphql/execution/execute";
import { Log } from "web3-core";
import { Contract, EventData } from "web3-eth-contract";
import { Config } from "../../config";
import { web3 } from "../../loaders/web3";
import { EventDb, EventModel } from "../../models/dex/event"
import { StableswapDayData } from "../../models/dex/stableswapDayData";
import { pairCreatedEventHandler } from "../../services/dex/eventHandlers/baseV1Factory";
import { PairCreatedEventInput } from "../../types/event/dex/baseV1Factory";
import {
  BaseV1FactoryABI,
  PairCreated,
  PairCreatedEventAbiInputs,
} from "../../utils/abiParser/baseV1factory";

export async function baseV1FactoryIndexHistoricalEvents(
  latestBlockNumber: number
) {
  console.log("BaseV1Factory");
  const iter = Math.floor(latestBlockNumber / 10_000);
  // console.log(iter);
  const t = await web3.eth.getProtocolVersion();
  console.log(t);
  const FACTORY_ADDRESS = Config.contracts.baseV1Factory.addresses[0];
  const stableswapFactory = await new web3.eth.Contract(
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
      let eventId = event.transactionHash.concat("-").concat(event.logIndex.toString());
      // check if event already indexed before
      var eventIndex = await EventModel.findOne({id: eventId}).exec();
      console.log(eventIndex);
      if (eventIndex != null) {
        console.log("Skip Prev Indexed: ", eventId);
        continue;
      }

      const decodedLog = web3.eth.abi.decodeLog(
        PairCreatedEventAbiInputs,
        event.raw.data,
        event.raw.topics.slice(1)
      );
      const input = new PairCreatedEventInput(event.returnValues);
      await pairCreatedEventHandler(event, input);
      
      // add event as indexed
      var eventDb = new EventDb(eventId);
      await new EventModel(eventDb).save();
      console.log(`New PairCreated!`, event.blockNumber);
    }
  }

  await contract
    .getPastEvents(PairCreated, options)
    .then(async (events) => await processorServiceFunction(events));
}

// UPGRADE
export async function indexFactoryEvents(start: number, end: number) {
  const options = {
    fromBlock: start,
    toBlock: end,
    topics: Config.contracts.baseV1Factory.events.options.signatures,
  }
  console.log("BaseV1Factory", start, end);

  async function processorServiceFunction(events: EventData[]) {
    for (let event of events) {
      let eventId = event.transactionHash.concat("-").concat(event.logIndex.toString());
      // check if event already indexed before
      var eventIndex = await EventModel.findOne({ id: eventId }).exec();
      if (eventIndex != null) {
        console.log("Skip Prev Indexed: ", eventId);
        continue;
      }

      //
      var eventName = event.event;
      if (eventName === PairCreated) {
        const input = new PairCreatedEventInput(event.returnValues);
        await pairCreatedEventHandler(event, input);
      } else {
      }

      // add event as indexed
      var eventDb = new EventDb(eventId);
      await new EventModel(eventDb).save();
      console.log(`Factory `, event.event, event.blockNumber, event.transactionHash);
    }
  }

  const FACTORY_ADDRESS = Config.contracts.baseV1Factory.addresses[0];
  const contract = await new web3.eth.Contract(
    BaseV1FactoryABI,
    FACTORY_ADDRESS
  );

  await contract
    .getPastEvents(PairCreated, options)
    .then(async (events) => await processorServiceFunction(events));
}
