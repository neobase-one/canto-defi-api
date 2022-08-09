import { baseV1FactoryIndexHistoricalEvents } from "./baseV1FactorySubscribers";
import { baseV1PairIndexHistoricalEvents } from "./baseV1PairSubscribers";
import { blockIndexHistorical } from "./blockSubscribers";

export async function indexHistoricalEvents(latestBlockNumber: number) {
  // Block
  await blockIndexHistorical(latestBlockNumber);
  
  // BaseV1Factory
  await baseV1FactoryIndexHistoricalEvents(latestBlockNumber);

  // BaseV1Pair
  await baseV1PairIndexHistoricalEvents(latestBlockNumber);
}

export async function initSubscribers() { };
