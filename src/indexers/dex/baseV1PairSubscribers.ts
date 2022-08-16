import { Log } from "web3-core";
import { Contract, EventData } from "web3-eth-contract";
import { Config } from "../../config";
import { web3 } from "../../loaders/web3";
import { BaseV1PairABI, Burn, BurnEventAbiInputs, Mint, MintEventAbiInputs, Swap, SwapEventAbiInputs, Sync, SyncEventAbiInputs, Transfer, TransferEventAbiInputs } from "../../utils/abiParser/baseV1Pair";
import { BurnEventInput, MintEventInput, SwapEventInput, SyncEventInput, TransferEventInput } from "../../types/event/dex/baseV1Pair";
import { burnEventHandler, mintEventHandler, swapEventHandler, syncEventHandler, transferEventHandler } from "../../services/dex/eventHandlers/baseV1Pair";
import { EventDb, EventModel } from "../../models/dex/event";
import { PairModel } from "../../models/dex/pair";
import { ALL_EVENTS } from "../../utils/constants";


export async function baseV1PairIndexHistoricalEvents(
  latestBlockNumber: number
) {
  console.log("BaseV1Pair");
  const iter = Math.floor(latestBlockNumber / 10_000);
  // console.log(iter);
  const t = await web3.eth.getProtocolVersion();
  console.log(t);
  const addresses = Config.contracts.baseV1Pair.addresses;

  // console.log(contract);
  for (var i = 0; i < iter; i++) {
    for (let address of addresses) {
      const contract = await new web3.eth.Contract(BaseV1PairABI, address);

      // Transfer
      await transferRangeEventHandler(contract, i);

      // Mint
      await mintRangeEventHandler(contract, i);

      // // Burn
      await burnRangeEventHandler(contract, i);

      // // Swap
      await swapRangeEventHandler(contract, i);

      // // Sync
      await syncRangeEventHandler(contract, i);
    }
  }
  // web3.eth.clearSubscriptions(); // todo
}

async function mintRangeEventHandler(contract: Contract, start: number) {
  const range = Config.canto.rpcBlockRange;
  const options = {
    fromBlock: start * range,
    toBlock: (start + 1) * range,
    // address: Config.contracts.baseV1Pair.addresses,
    topics: [Config.contracts.baseV1Pair.events.mint.signature],
  };

  async function processorServiceFunction(events: EventData[]) {
    for (let event of events) {
      const decodedLog = web3.eth.abi.decodeLog(
        MintEventAbiInputs,
        event.raw.data,
        event.raw.topics.slice(1)
      );
      console.log(`New Mint!`, event.blockNumber, event.address);
      const input = new MintEventInput(event.returnValues);
      await mintEventHandler(event, input);
    }
  }

  contract
    .getPastEvents(Mint, options)
    .then(async (events) => await processorServiceFunction(events));
}

async function burnRangeEventHandler(contract: Contract, start: number) {
  const range = Config.canto.rpcBlockRange;
  const options = {
    fromBlock: start * range,
    toBlock: (start + 1) * range,
    // address: Config.contracts.baseV1Pair.addresses,
    topics: [Config.contracts.baseV1Pair.events.burn.signature],
  };

  async function processorServiceFunction(events: EventData[]) {
    for (let event of events) {
      const decodedLog = web3.eth.abi.decodeLog(
        BurnEventAbiInputs,
        event.raw.data,
        event.raw.topics.slice(1)
      );
      console.log(`New Burn!`, event.blockNumber, event.address);
      const input = new BurnEventInput(event.returnValues);
      await burnEventHandler(event, input);
    }
  }

  contract
    .getPastEvents(Burn, options)
    .then(async (events) => await processorServiceFunction(events));
}

async function swapRangeEventHandler(contract: Contract, start: number) {
  const range = Config.canto.rpcBlockRange;
  const options = {
    fromBlock: start * range,
    toBlock: (start + 1) * range,
    // address: Config.contracts.baseV1Pair.addresses,
    topics: [Config.contracts.baseV1Pair.events.swap.signature],
  };

  async function processorServiceFunction(events: EventData[]) {
    for (let event of events) {
      const decodedLog = web3.eth.abi.decodeLog(
        SwapEventAbiInputs,
        event.raw.data,
        event.raw.topics.slice(1)
      );
      console.log(`New Swap!`, event.blockNumber, event.address);
      const input = new SwapEventInput(event.returnValues);
      await swapEventHandler(event, input);
    }
  }

  contract
    .getPastEvents(Swap, options)
    .then(async (events) => await processorServiceFunction(events));
}

async function transferRangeEventHandler(contract: Contract, start: number) {
  const range = Config.canto.rpcBlockRange;
  const options = {
    fromBlock: start * range,
    toBlock: (start + 1) * range,
    // address: Config.contracts.baseV1Pair.addresses,
    topics: [Config.contracts.baseV1Pair.events.transfer.signature],
  };

  async function processorServiceFunction(events: EventData[]) {
    for (let event of events) {
      const decodedLog = web3.eth.abi.decodeLog(
        TransferEventAbiInputs,
        event.raw.data,
        event.raw.topics.slice(1)
      );
      console.log(`New Transfer!`, event.blockNumber, event.address);
      const input = new TransferEventInput(event.returnValues);
      await transferEventHandler(event, input);
    }
  }

  await contract
    .getPastEvents(Transfer, options)
    .then(async (events) => await processorServiceFunction(events));
}

async function syncRangeEventHandler(contract: Contract, start: number) {
  const range = Config.canto.rpcBlockRange;
  const options = {
    fromBlock: start * range,
    toBlock: (start + 1) * range,
    // address: Config.contracts.baseV1Pair.addresses,
    topics: [Config.contracts.baseV1Pair.events.sync.signature],
  };

  async function processorServiceFunction(events: EventData[]) {
    for (let event of events) {
      const decodedLog = web3.eth.abi.decodeLog(
        SyncEventAbiInputs,
        event.raw.data,
        event.raw.topics.slice(1)
      );
      console.log(`New Sync!`, event.blockNumber, event.address);
      const input = new SyncEventInput(event.returnValues);
      await syncEventHandler(event, input);
    }
  }

  await contract
    .getPastEvents(Sync, options)
    .then(async (events) => await processorServiceFunction(events));
}

// UPGRADE
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

async function mintEventRangeHandler(contract: Contract, start: number, end: number) {
  const options = {
    fromBlock: start,
    toBlock: end,
    // address: Config.contracts.baseV1Pair.addresses,
    topics: [Config.contracts.baseV1Pair.events.mint.signature],
  };

  async function processorServiceFunction(events: EventData[]) {
    for (let event of events) {
      let eventId = event.transactionHash.concat("-").concat(event.logIndex.toString());
      // check if event already indexed before
      var eventIndex = await EventModel.findOne({id: eventId}).exec();
      if (eventIndex != null) {
        console.log("Skip Prev Indexed: ", eventId);
        continue;
      }

      const decodedLog = web3.eth.abi.decodeLog(
        MintEventAbiInputs,
        event.raw.data,
        event.raw.topics.slice(1)
      );
      const input = new MintEventInput(event.returnValues);
      await mintEventHandler(event, input);
      
      // add event as indexed
      var eventDb = new EventDb(eventId);
      await new EventModel(eventDb).save();
      console.log(`New Mint!`, event.blockNumber, event.address);
    }
  }

  contract
    .getPastEvents(Mint, options)
    .then(async (events) => await processorServiceFunction(events));
}

async function burnEventRangeHandler(contract: Contract, start: number, end: number) {
  const range = Config.canto.rpcBlockRange;
  const options = {
    fromBlock: start,
    toBlock: end,
    // address: Config.contracts.baseV1Pair.addresses,
    topics: [Config.contracts.baseV1Pair.events.burn.signature],
  };

  async function processorServiceFunction(events: EventData[]) {
    for (let event of events) {
      let eventId = event.transactionHash.concat("-").concat(event.logIndex.toString());
      // check if event already indexed before
      var eventIndex = await EventModel.findOne({id: eventId}).exec();
      if (eventIndex != null) {
        console.log("Skip Prev Indexed: ", eventId);
        continue;
      }

      const decodedLog = web3.eth.abi.decodeLog(
        BurnEventAbiInputs,
        event.raw.data,
        event.raw.topics.slice(1)
      );
      const input = new BurnEventInput(event.returnValues);
      await burnEventHandler(event, input);
      
      // add event as indexed
      var eventDb = new EventDb(eventId);
      await new EventModel(eventDb).save();
      console.log(`New Burn!`, event.blockNumber, event.address);
    }
  }

  contract
    .getPastEvents(Burn, options)
    .then(async (events) => await processorServiceFunction(events));
}

async function swapEventRangeHandler(contract: Contract, start: number, end: number) {
  const range = Config.canto.rpcBlockRange;
  const options = {
    fromBlock: start,
    toBlock: end,
    // address: Config.contracts.baseV1Pair.addresses,
    topics: [Config.contracts.baseV1Pair.events.swap.signature],
  };

  async function processorServiceFunction(events: EventData[]) {
    for (let event of events) {
      let eventId = event.transactionHash.concat("-").concat(event.logIndex.toString());
      // check if event already indexed before
      var eventIndex = await EventModel.findOne({id: eventId}).exec();
      if (eventIndex != null) {
        console.log("Skip Prev Indexed: ", eventId);
        continue;
      }

      const decodedLog = web3.eth.abi.decodeLog(
        SwapEventAbiInputs,
        event.raw.data,
        event.raw.topics.slice(1)
      );
      const input = new SwapEventInput(event.returnValues);
      await swapEventHandler(event, input);
      
      // add event as indexed
      var eventDb = new EventDb(eventId);
      await new EventModel(eventDb).save();
      console.log(`New Swap!`, event.blockNumber, event.address);
    }
  }

  contract
    .getPastEvents(Swap, options)
    .then(async (events) => await processorServiceFunction(events));
}

async function transferEventRangeHandler(contract: Contract, start: number, end: number) {
  const range = Config.canto.rpcBlockRange;
  const options = {
    fromBlock: start,
    toBlock: end,
    // address: Config.contracts.baseV1Pair.addresses,
    topics: [Config.contracts.baseV1Pair.events.transfer.signature],
  };

  async function processorServiceFunction(events: EventData[]) {
    for (let event of events) {
      let eventId = event.transactionHash.concat("-").concat(event.logIndex.toString());
      // check if event already indexed before
      var eventIndex = await EventModel.findOne({id: eventId}).exec();
      if (eventIndex != null) {
        console.log("Skip Prev Indexed: ", eventId);
        continue;
      }

      const decodedLog = web3.eth.abi.decodeLog(
        TransferEventAbiInputs,
        event.raw.data,
        event.raw.topics.slice(1)
      );
      const input = new TransferEventInput(event.returnValues);
      await transferEventHandler(event, input);
      
      // add event as indexed
      var eventDb = new EventDb(eventId);
      await new EventModel(eventDb).save();
      console.log(`New Transfer!`, event.blockNumber, event.address);
    }
  }

  await contract
    .getPastEvents(Transfer, options)
    .then(async (events) => await processorServiceFunction(events));
}

async function syncEventRangeHandler(contract: Contract, start: number, end: number) {
  const range = Config.canto.rpcBlockRange;
  const options = {
    fromBlock: start,
    toBlock: end,
    // address: Config.contracts.baseV1Pair.addresses,
    topics: [Config.contracts.baseV1Pair.events.sync.signature],
  };

  async function processorServiceFunction(events: EventData[]) {
    for (let event of events) {
      let eventId = event.transactionHash.concat("-").concat(event.logIndex.toString());
      // check if event already indexed before
      var eventIndex = await EventModel.findOne({id: eventId}).exec();
      if (eventIndex != null) {
        console.log("Skip Prev Indexed: ", eventId);
        continue;
      }
      
      const decodedLog = web3.eth.abi.decodeLog(
        SyncEventAbiInputs,
        event.raw.data,
        event.raw.topics.slice(1)
      );
      const input = new SyncEventInput(event.returnValues);
      await syncEventHandler(event, input);
      
      // add event as indexed
      var eventDb = new EventDb(eventId);
      await new EventModel(eventDb).save();
      console.log(`New Sync!`, event.blockNumber, event.address);
    }
  }

  await contract
    .getPastEvents(Sync, options)
    .then(async (events) => await processorServiceFunction(events));
}
