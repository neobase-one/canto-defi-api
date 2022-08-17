import { EventData } from "web3-eth-contract";
import { Config } from "../../config";
import { web3 } from "../../loaders/web3";
import { EventDb, EventModel } from "../../models/dex/event";
import { burnEventHandler, mintEventHandler, swapEventHandler, syncEventHandler, transferEventHandler } from "../../services/dex/eventHandlers/baseV1Pair";
import { BurnEventInput, MintEventInput, SwapEventInput, SyncEventInput, TransferEventInput } from "../../types/event/dex/baseV1Pair";
import { BaseV1PairABI, Burn, Mint, Swap, Sync, Transfer } from "../../utils/abiParser/baseV1Pair";
import { ALL_EVENTS } from "../../utils/constants";



export async function indexPairEvents(start: number, end: number) {
  console.log("BaseV1Pair", start, end);

  const t = await web3.eth.getProtocolVersion();
  console.log(t);

  // var addresses = await PairModel.distinct('id').exec();
  const addresses = Config.contracts.baseV1Pair.addresses;

  for (let address of addresses) {
    const options = {
      fromBlock: start,
      toBlock: end,
      // topics: signatures, // doesn't work with this param for some reason
    };

    const contract = await new web3.eth.Contract(BaseV1PairABI, address);

    await contract
      .getPastEvents(ALL_EVENTS, options)
      .then(async (events) => await processEvents(events));
  }
  // web3.eth.clearSubscriptions(); // todo
}

async function processEvents(events: EventData[]) {
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
    if (eventName === Transfer) {
      const input = new TransferEventInput(event.returnValues);
      await transferEventHandler(event, input);
    } else if (eventName === Mint) {
      const input = new MintEventInput(event.returnValues);
      await mintEventHandler(event, input);
    } else if (eventName === Burn) {
      const input = new BurnEventInput(event.returnValues);
      await burnEventHandler(event, input);
    } else if (eventName === Swap) {
      const input = new SwapEventInput(event.returnValues);
      await swapEventHandler(event, input);
    } else if (eventName === Sync) {
      const input = new SyncEventInput(event.returnValues);
      await syncEventHandler(event, input);
    } else {
    }

    // add event as indexed
    var eventDb = new EventDb(eventId);
    await new EventModel(eventDb).save();
    console.log(`Pair `, event.event, event.blockNumber, event.transactionHash);
  }

}
