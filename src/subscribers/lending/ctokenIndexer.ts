import { EventData } from "web3-eth-contract";
import { web3 } from "../../loaders/web3";
import { EventModel, EventDb } from "../../models/dex/event";
import {
  handleBorrowEvent,
  handleRepayBorrowEvent,
  handleLiquidateBorrowEvent,
  handleAccrueInterestEvent,
  handleNewReserveFactorEvent,
  handleTransferEvent,
  handleNewMarketInterestRateModelEvent,
} from "../../services/lending/eventHandlers/ctoken";
import {
  AccrueInterestInput,
  BorrowInput,
  LiquidateBorrowInput,
  NewMarketInterestRateModelInput,
  NewReserveFactorInput,
  RepayBorrowInput,
  TransferInput,
} from "../../types/event/lending/ctoken";
import {
  AccrueInterest,
  Borrow,
  cTokenABI,
  LiquidateBorrow,
  NewMarketInterestRateModel,
  NewReserveFactor,
  RepayBorrow,
  Transfer,
} from "../../utils/abiParser/ctoken";
import { ALL_EVENTS } from "../../utils/constants";

export async function indexcTokenEvents(start: number, end: number) {
  console.log("cTokens", start, end);

  let addresses: any = []; // todo:

  for (let address of addresses) {
    const options = {
      fromBlock: start,
      toBlock: end,
      // topics: signatures, // doesn't work with this param for some reason
    };

    const contract = await new web3.eth.Contract(cTokenABI, address);

    await contract
      .getPastEvents(ALL_EVENTS, options)
      .then(async (events) => await processEvents(events));
  }
}

async function processEvents(events: EventData[]) {
  for (let event of events) {
    // check if event already indexed before
    let eventId = event.transactionHash.concat("-").concat(event.logIndex.toString());
    // check if event already indexed before
    var eventIndex = await EventModel.findOne({ id: eventId }).exec();
    console.log(eventIndex);
    if (eventIndex != null) {
      console.log("Skip Prev Indexed: ", eventId);
      continue;
    }

    //
    var eventName = event.event;
    if (eventName === Borrow) {
      let input = new BorrowInput(event.returnValues);
      handleBorrowEvent(event, input);
    } else if (eventName === RepayBorrow) {
      let input = new RepayBorrowInput(event.returnValues);
      handleRepayBorrowEvent(event, input);
    } else if (eventName === LiquidateBorrow) {
      let input = new LiquidateBorrowInput(event.returnValues);
      handleLiquidateBorrowEvent(event, input);
    } else if (eventName === AccrueInterest) {
      let input = new AccrueInterestInput(event.returnValues);
      handleAccrueInterestEvent(event, input);
    } else if (eventName === NewReserveFactor) {
      let input = new NewReserveFactorInput(event.returnValues);
      handleNewReserveFactorEvent(event, input);
    } else if (eventName === Transfer) {
      let input = new TransferInput(event.returnValues);
      handleTransferEvent(event, input);
    } else if (eventName === NewMarketInterestRateModel) {
      let input = new NewMarketInterestRateModelInput(event.returnValues);
      handleNewMarketInterestRateModelEvent(event, input);
    } else {
    }

    // add event as indexed
    var eventDb = new EventDb(eventId);
    await new EventModel(eventDb).save();
    console.log(`New {}! {}`, event.event, event.blockNumber);
  }
}
