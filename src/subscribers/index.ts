import { baseV1FactoryIndexHistoricalEvents } from "./baseV1FactorySubscribers";
import { baseV1PairIndexHistoricalEvents } from "./baseV1PairSubscribers";

export async function indexHistoricalEvents(latestBlockNumber: number) {
  // BaseV1Factory
  await baseV1FactoryIndexHistoricalEvents(latestBlockNumber);

  // BaseV1Pair
  await baseV1PairIndexHistoricalEvents(latestBlockNumber);
}

export async function initSubscribers() { };
