import dotenv from "dotenv";
import Web3 from "web3";
import { PairCreatedEventSignature } from "../utils/abiParser/baseV1factory";
import {
  BurnEventSignature,
  MintEventSignature,
  SwapEventSignature,
  SyncEventSignature,
  TransferEventSignature,
} from "../utils/abiParser/baseV1Pair";

// load env var
dotenv.config();

// default -> NODE_ENV: development
process.env.NODE_ENV = process.env.NODE_ENV || "development";

export const Config = {
  // server port
  port: parseInt(process.env.PORT || "8080"),

  index: process.env.INDEX || "FALSE", // TRUE or FALSE

  // database url
  databaseUrl: process.env.MONGODB_URI || "",

  // logs
  logs: {
    level: process.env.LOG_LEVEL || "debug",
  },

  // api conf
  api: {
    prefix: "/",
  },

  // CANTO NODE
  canto: {
    rpcBlockRange: parseInt(process.env.MAX_BLOCK_RANGE || "5000"),
    latestBlockNumber: parseInt(process.env.LATEST_BLOCK_NUMBER || "250000"),
    jsonRpcUrl: process.env.JSON_RPC_URL || "",
    websocketUrl: process.env.WEBSOCKET_URL || "",
  },

  // CONTRACT ADDRESSES
  contracts: {
    baseV1Factory: {
      addresses: ["0xE387067f12561e579C5f7d4294f51867E0c1cFba"],
      events: {
        pairCreated: {
          signature: Web3.utils.keccak256(PairCreatedEventSignature),
        },
        options: {
          signatures: [
            Web3.utils.keccak256(PairCreatedEventSignature),
          ],
        },
      },
    },
    baseV1Pair: {
      addresses: [
        "0x1D20635535307208919f0b67c3B2065965A85aA9", // note/canto
        "0x35DB1f3a6A6F07f82C76fCC415dB6cFB1a7df833", // note/usdt
        "0x9571997a66D63958e1B3De9647C22bD6b9e7228c", // note/usdc
        "0x216400ba362d8FCE640085755e47075109718C8B", // canto/eth
        "0x30838619C55B787BafC3A4cD9aEa851C1cfB7b19", // canto/atom
      ],
      events: {
        mint: {
          signature: Web3.utils.keccak256(MintEventSignature),
        },
        burn: {
          signature: Web3.utils.keccak256(BurnEventSignature),
        },
        swap: {
          signature: Web3.utils.keccak256(SwapEventSignature),
        },
        transfer: {
          signature: Web3.utils.keccak256(TransferEventSignature),
        },
        sync: {
          signature: Web3.utils.keccak256(SyncEventSignature),
        },
        options: {
          signatures: [
            Web3.utils.keccak256(MintEventSignature),
            Web3.utils.keccak256(BurnEventSignature),
            Web3.utils.keccak256(SwapEventSignature),
            Web3.utils.keccak256(TransferEventSignature),
            Web3.utils.keccak256(SyncEventSignature),
          ],
        },
      },
    },
  },
};
