import Container from "typedi";
import { EventData } from "web3-eth-contract";
import { AccountCTokenModel } from "../../../models/lending/accountCToken";
import { ComptrollerDb } from "../../../models/lending/comptroller";
import { MarketEnteredInput, MarketExitedInput, MarketListedInput, NewCloseFactorInput, NewCollateralFactorInput, NewLiquidationIncentiveInput, NewPriceOracleInput } from "../../../types/event/lending/comptroller";
import { getTimestamp } from "../../../utils/helper";
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

    let market: any = await marketService.getByAddress(event.address);
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
    let market = await marketService.getByAddress(event.address);
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
        const cToken = new AccountCTokenModel(cTokenStats);
        cToken.isNew = false;
        await cToken.save();
    }
}

export async function handleMarketExitedEvent(
    event: EventData,
    input: MarketExitedInput
) {
    // service
    const marketService = Container.get(MarketService);
    let market = await marketService.getByAddress(event.address);
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
        cTokenStats.enteredMarket = false
        const cToken = new AccountCTokenModel(cTokenStats);
        cToken.isNew = false;
        await cToken.save();
    }
}

export async function handleNewCloseFactorEvent(
    event: EventData,
    input: NewCloseFactorInput
) {
    // service
    const comptrollerService = Container.get(ComptrollerService);

    let comptroller = await comptrollerService.getById('1');
    if (comptroller !== null) {
        comptroller.closeFactor = input.newCloseFactorMantissa
        comptroller.isNew = false;
        await comptroller.save();
    }
}

export async function handleNewCollateralFactorEvent(
    event: EventData,
    input: NewCollateralFactorInput
) {// service
    const marketService = Container.get(MarketService);

    let market = await marketService.getByAddress(event.address);
    if (market !== null) {
        market.collateralFactor = input.newCollateralFactorMantissa;
        market.isNew = false;
        await market.save();
    }
}

export async function handleNewLiquidationIncentiveEvent(
    event: EventData,
    input: NewLiquidationIncentiveInput
) {
    // service
    const comptrollerService = Container.get(ComptrollerService);

    let comptroller = await comptrollerService.getById('1');
    if (comptroller !== null) {
        comptroller.liquidationIncentive = input.newLiquidationIncentiveMantissa;
        comptroller.isNew = false;
        await comptroller.save();
    }
}

export async function handleNewPriceOracleEvent(
    event: EventData,
    input: NewPriceOracleInput
) {
    // service
    const comptrollerService = Container.get(ComptrollerService);

    let comptroller: any = await comptrollerService.getById('1');
    if (comptroller === null) {
        comptroller = new ComptrollerDb('1');
    } else {
        comptroller.isNew = false;
    }
    comptroller.priceOracle = input.newPriceOracle;
    await comptroller.save();
}