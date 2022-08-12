import Decimal from "decimal.js";
import { LiquidityPosition } from "../models/dex/liquidityPosition";
import { Pair } from "../models/dex/pair";
import { Token } from "../models/dex/token";
import { Transaction } from "../models/dex/transaction";
import { User } from "../models/dex/user";

export const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";

// export let ZERO_BI = BigInt.fromI32(0)
// export let ONE_BI = BigInt.fromI32(1)
export const ZERO_BD = new Decimal("0");
export const ONE_BD = new Decimal("1");
export let BI_18 = 18;
// export const EMPTY_TRANSACTION = new Transaction("");
// export const EMPTY_PAIR = new Pair("");
// export const EMPTY_USER = new User("");
// export const EMPTY_POSITION = new LiquidityPosition("");
// export const EMPTY_TOKEN = new Token("");

export const ALL_EVENTS = "allEvents";
