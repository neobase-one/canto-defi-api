import { EventData } from "web3-eth-contract";
import { MarketEnteredInput, MarketExitedInput, NewCloseFactorInput, NewCollateralFactorInput, NewLiquidationIncentiveInput, NewPriceOracleInput } from "../../../types/event/lending/comptroller";

// todo: remove unused services

export async function handleMarketEnteredEvent(
    event: EventData,
    input: MarketEnteredInput
) {

}

export async function handleMarketExitedEvent(
    event: EventData,
    input: MarketExitedInput
) { }

export async function handleNewCloseFactorEvent(
    event: EventData,
    input: NewCloseFactorInput
) { }

export async function handleNewCollateralFactorEvent(
    event: EventData,
    input: NewCollateralFactorInput
) { }

export async function handleNewLiquidationIncentiveEvent(
    event: EventData,
    input: NewLiquidationIncentiveInput
) { }

export async function handleNewPriceOracleEvent(
    event: EventData,
    input: NewPriceOracleInput
) { }