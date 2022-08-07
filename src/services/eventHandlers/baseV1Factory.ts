import Decimal from "decimal.js";
import Container from "typedi";
import { Log } from "web3-core";
import { Contract, EventData } from "web3-eth-contract";
import { Config } from "../../config";
import { Bundle, BundleModel } from "../../models/bundle";
import { StableswapFactory, StableswapFactoryModel } from "../../models/stableswapFactory";
import { PairCreatedEventInput } from "../../types/event/baseV1Factory";
import { StableswapFactoryService } from "./models/stableswapFactory";
import { setTimeout } from "timers/promises";

export async function initFactoryCollection() {
  const FACTORY_ADDRESS = Config.contracts.baseV1Factory.addresses[0];
  // create new factory w address
  let factory = new StableswapFactory(FACTORY_ADDRESS);
  // console.log("INIT", factory);
  await new StableswapFactoryModel(factory).save();

  // create new bundle
  let bundle = new Bundle('1');
  // console.log(bundle);
  await new BundleModel(bundle).save();
}

export async function pairCreatedEventHandler(
  event: EventData,
  inputs: PairCreatedEventInput
) {
  // console.log("PC", event.blockNumber)
  const FACTORY_ADDRESS = Config.contracts.baseV1Factory.addresses[0];

  // services
  const factoryService = Container.get(StableswapFactoryService);

  // update factory
  // let factory: any = await factoryService.getStablewsapFactory(FACTORY_ADDRESS);
  let factory: any = await StableswapFactoryModel.findOne({address: FACTORY_ADDRESS}).exec();
  factory.pairCount = factory.pairCount + 1;
  factory.block = new Decimal(event.blockNumber);
  // console.log(factory);
  // console.log("PC", factory);

  // create tokens


  // save updated objects
  // todo: not waiting for update
  // await StableswapFactoryModel.updateOne(factory);
  const val = await factory.save();
}

