import Container from "typedi";
import { EventData } from "web3-eth-contract";
import { AccountCTokenModel } from "../../../models/lending/accountCToken";
import { ComptrollerDb } from "../../../models/lending/comptroller";
import { Market, MarketDb } from "../../../models/lending/market";
import { MarketEnteredInput, MarketExitedInput, MarketListedInput, NewCloseFactorInput, NewCollateralFactorInput, NewLiquidationIncentiveInput, NewPriceOracleInput } from "../../../types/event/lending/comptroller";
import { getTimestamp } from "../../../utils/helper";
import { AccountCTokenService } from "../models/accountCToken";
import { ComptrollerService } from "../models/comptroller";
import { createMarket, updateCommonCTokenStats } from "../models/helper";
import { MarketService } from "../models/market";

// todo: remove unused services
export async function handleMarketListedEvent(
    event: EventData,
    input: MarketListedInput
) {
    // service
    const marketService = Container.get(MarketService);

    let market: MarketDb = await marketService.getByAddress(event.address) as MarketDb;
    if (market === null) {
        let address = input.cToken;
        await createMarket(address);
    }
}

export async function handleMarketEnteredEvent(
    event: EventData,
    input: MarketEnteredInput
) {
    // service
    const marketService = Container.get(MarketService);
    let actService = Container.get(AccountCTokenService);

    let market: MarketDb = await marketService.getByAddress(event.address) as MarketDb;
    if (market !== null) {
        let accountID = input.account;
        let timestamp = await getTimestamp(event.blockNumber);
        let cTokenStats = await updateCommonCTokenStats(
            market.id,
            market.symbol,
            accountID,
            event.transactionHash,
            timestamp,
            event.blockNumber,
        )
        cTokenStats.enteredMarket = true
        await actService.save(cTokenStats);
    }
}

export async function handleMarketExitedEvent(
    event: EventData,
    input: MarketExitedInput
) {
    // service
    const marketService = Container.get(MarketService);
    let actService = Container.get(AccountCTokenService);

    let market: MarketDb = await marketService.getByAddress(event.address) as MarketDb;
    if (market !== null) {
        let accountID = input.account;
        let timestamp = await getTimestamp(event.blockNumber);
        let cTokenStats  = await updateCommonCTokenStats(
            market.id,
            market.symbol,
            accountID,
            event.transactionHash,
            timestamp,
            event.blockNumber,
        )
        cTokenStats.enteredMarket = false

        await actService.save(cTokenStats);
    }
}

export async function handleNewCloseFactorEvent(
    event: EventData,
    input: NewCloseFactorInput
) {
    // service
    const comptrollerService = Container.get(ComptrollerService);

    let comptroller: ComptrollerDb = await comptrollerService.getById('1') as ComptrollerDb;
    if (comptroller !== null) {
        comptroller.closeFactor = input.newCloseFactorMantissa

        await comptrollerService.save(comptroller);
    }
}

export async function handleNewCollateralFactorEvent(
    event: EventData,
    input: NewCollateralFactorInput
) {// service
    const marketService = Container.get(MarketService);

    let market: MarketDb = await marketService.getByAddress(event.address) as MarketDb;
    if (market !== null) {
        market.collateralFactor = input.newCollateralFactorMantissa;

        await marketService.save(market);
    }
}

export async function handleNewLiquidationIncentiveEvent(
    event: EventData,
    input: NewLiquidationIncentiveInput
) {
    // service
    const comptrollerService = Container.get(ComptrollerService);

    let comptroller: ComptrollerDb = await comptrollerService.getById('1') as ComptrollerDb;
    if (comptroller !== null) {
        comptroller.liquidationIncentive = input.newLiquidationIncentiveMantissa;

        await comptrollerService.save(comptroller);
    }
}

export async function handleNewPriceOracleEvent(
    event: EventData,
    input: NewPriceOracleInput
) {
    // service
    const comptrollerService = Container.get(ComptrollerService);

    let comptroller: ComptrollerDb = await comptrollerService.getById('1') as ComptrollerDb;
    if (comptroller === null) {
        comptroller = new ComptrollerDb('1');
    }

    comptroller.priceOracle = input.newPriceOracle;
    await comptrollerService.save(comptroller);
}