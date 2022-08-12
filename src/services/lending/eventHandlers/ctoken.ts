import { EventData } from "web3-eth-contract";
import { AccrueInterestInput, BorrowInput, LiquidateBorrowInput, NewMarketInterestRateModelInput, NewReserveFactorInput, RepayBorrowInput, TransferInput } from "../../../types/event/lending/ctoken";

// todo: remove unused services

export async function handleBorrowEvent(
    event: EventData,
    input: BorrowInput
) {

}

export async function handleRepayBorrowEvent(
    event: EventData,
    input: RepayBorrowInput
) {

}

export async function handleLiquidateBorrowEvent(
    event: EventData,
    input: LiquidateBorrowInput
) {

}

export async function handleAccrueInterestEvent(
    event: EventData,
    input: AccrueInterestInput
) {

}

export async function handleNewReserveFactorEvent(
    event: EventData,
    input: NewReserveFactorInput
) {

}

export async function handleTransferEvent(
    event: EventData,
    input: TransferInput
) {

}

export async function handleNewMarketInterestRateModelEvent(
    event: EventData,
    input: NewMarketInterestRateModelInput
) {

}