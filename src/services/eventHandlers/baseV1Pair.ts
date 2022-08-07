import { Log } from "web3-core";
import { EventData } from "web3-eth-contract";
import {
  BurnEventInput,
  MintEventInput,
  SwapEventInput,
  SyncEventInput,
  TransferEventInput,
} from "../../types/event/baseV1Pair";

export async function mintEventHandler(event: EventData, input: MintEventInput) {

}

export async function burnEventHandler(event: EventData, input: BurnEventInput) {

}

export async function swapEventHandler(event: EventData, input: SwapEventInput) {

}

export async function transferEventHandler(event: EventData, input: TransferEventInput) {

}

export async function syncEventHandler(event: EventData, input: SyncEventInput) {
  
}
