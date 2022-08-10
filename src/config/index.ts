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
      addresses: ["0xE007cAc018C8bFFc70dFD0E8f6C24b2E7CFcefB9"],
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
        "0x406376a1ea40cf149A31f6e23638f99900988f46", // note/usdt
        "0x753eF0D3506D70D8266335C16A5ed7cC71Aa376a", // note/usdc
        "0x03cD777F7DA9EE2884fc2FD111808467C4Df0203", // canto/eth
        "0x4C7504dFEe142849d59a96D4A1954eE9c7ea7437", // canto/atom
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
