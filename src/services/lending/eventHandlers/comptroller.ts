import Container from "typedi";
import { EventData } from "web3-eth-contract";
import { MarketEnteredInput, MarketExitedInput, NewCloseFactorInput, NewCollateralFactorInput, NewLiquidationIncentiveInput, NewPriceOracleInput } from "../../../types/event/lending/comptroller";
import { MarketService } from "../models/market";

// todo: remove unused services

export async function handleMarketEnteredEvent(
    event: EventData,
    input: MarketEnteredInput
) {
    // service
    const marketService = Container.get(MarketService);

    let market = await marketService.getByAddress(event.address);

    //no action on market objects
    //todo::updation of accountCToken table


}

export async function handleMarketExitedEvent(
    event: EventData,
    input: MarketExitedInput
) {
    // service
    const marketService = Container.get(MarketService);

    let market = await marketService.getByAddress(event.address);

    //no action on market objects
    //todo::updation of accountCToken table
}

export async function handleNewCloseFactorEvent(
    event: EventData,
    input: NewCloseFactorInput
) {
    // service
    const marketService = Container.get(MarketService);

    let market = await marketService.getByAddress(event.address);

    //no action on market objects
    //todo::updation of accountCToken table
}

export async function handleNewCollateralFactorEvent(
    event: EventData,
    input: NewCollateralFactorInput
) {// service
    const marketService = Container.get(MarketService);

    let market = await marketService.getByAddress(event.address);
    if (market !== null) {
        market.collateralFactor = input.newCloseFactorMantissa;
        market.save();
    }
}

export async function handleNewLiquidationIncentiveEvent(
    event: EventData,
    input: NewLiquidationIncentiveInput
) {
    // service
    const marketService = Container.get(MarketService);

    let market = await marketService.getByAddress(event.address);

    //no action on market objects
 }

export async function handleNewPriceOracleEvent(
    event: EventData,
    input: NewPriceOracleInput
) { 
    // service
    const marketService = Container.get(MarketService);

    let market = await marketService.getByAddress(event.address);

    //no action on market objects
}