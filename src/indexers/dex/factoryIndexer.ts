import { EventData } from "web3-eth-contract";
import { Config } from "../../config";
import { web3 } from "../../loaders/web3";
import { EventDb, EventModel } from "../../models/dex/event";
import { pairCreatedEventHandler } from "../../services/dex/eventHandlers/baseV1Factory";
import { PairCreatedEventInput } from "../../types/event/dex/baseV1Factory";
import {
  BaseV1FactoryABI,
  PairCreated
} from "../../utils/abiParser/baseV1factory";


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
