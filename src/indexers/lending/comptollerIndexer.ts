import { startTimer } from "winston";
import { web3 } from "../../loaders/web3";
import {
  ComptrollerABI,
  MarketEntered,
  MarketExited,
  NewCloseFactor,
  NewCollateralFactor,
  NewLiquidationIncentive,
  NewPriceOracle,
} from "../../utils/abiParser/comptroller";
import { ALL_EVENTS } from "../../utils/constants";
import { Contract, EventData } from "web3-eth-contract";
import {
  handleMarketEnteredEvent,
  handleMarketExitedEvent,
  handleNewCloseFactorEvent,
  handleNewCollateralFactorEvent,
  handleNewLiquidationIncentiveEvent,
  handleNewPriceOracleEvent,
} from "../../services/lending/eventHandlers/comptroller";
import {
  MarketEnteredInput,
  MarketExitedInput,
  NewCloseFactorInput,
  NewCollateralFactorInput,
  NewLiquidationIncentiveInput,
  NewPriceOracleInput,
} from "../../types/event/lending/comptroller";
import { EventDb, EventModel } from "../../models/dex/event";
import { Config } from "../../config";

export async function indexComptollerEvents(start: number, end: number) {
  console.log("Comptroller", start, end);
  const COMPTROLLER_ADDRESS = Config.contracts.comptroller.addresses[0];

  const options = {
    fromBlock: start,
    toBlock: end,
    // topics: signatures, // doesn't work with this param for some reason
  };

  const contract = await new web3.eth.Contract(
    ComptrollerABI,
    COMPTROLLER_ADDRESS
  );

  await contract
    .getPastEvents(ALL_EVENTS, options)
    .then(async (events) => await processEvents(events));
}

async function processEvents(events: EventData[]) {
  for (let event of events) {
    // check if event already indexed before
    let eventId = event.transactionHash
      .concat("-")
      .concat(event.logIndex.toString());
    // check if event already indexed before
    var eventIndex = await EventModel.findOne({ id: eventId }).exec();
    if (eventIndex != null) {
      console.log("Skip Prev Indexed: ", eventId);
      continue;
    }

    //
    var eventName = event.event;
    if (eventName === MarketEntered) {
      // console.log(event.blockNumber, event.event, event.transactionHash)
      let input = new MarketEnteredInput(event.returnValues);
      handleMarketEnteredEvent(event, input);
    } else if (eventName === MarketExited) {
      // console.log(event.blockNumber, event.event, event.transactionHash)
      let input = new MarketExitedInput(event.returnValues);
      handleMarketExitedEvent(event, input);
    } else if (eventName === NewCloseFactor) {
      // console.log(event.blockNumber, event.event, event.transactionHash)
      let input = new NewCloseFactorInput(event.returnValues);
      handleNewCloseFactorEvent(event, input);
    } else if (eventName === NewCollateralFactor) {
      // console.log(event.blockNumber, event.event, event.transactionHash)
      let input = new NewCollateralFactorInput(event.returnValues);
      handleNewCollateralFactorEvent(event, input);
    } else if (eventName === NewLiquidationIncentive) {
      // console.log(event.blockNumber, event.event, event.transactionHash)
      let input = new NewLiquidationIncentiveInput(event.returnValues);
      handleNewLiquidationIncentiveEvent(event, input);
    } else if (eventName === NewPriceOracle) {
      // console.log(event.blockNumber, event.event, event.transactionHash)
      let input = new NewPriceOracleInput(event.returnValues);
      handleNewPriceOracleEvent(event, input);
    } else {
    }

    // add event as indexed
    var eventDb = new EventDb(eventId);
    await new EventModel(eventDb).save();
    console.log(`Comptroller`, event.event, event.blockNumber, event.transactionHash);
  }
}
