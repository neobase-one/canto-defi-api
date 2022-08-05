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
    rpcBlockRange: 10_000,
    latestBlockNumber: parseInt(process.env.LATEST_BLOCK_NUMBER || "250000"),
    jsonRpcUrl: process.env.JSON_RPC_URL || "",
    websocketUrl: process.env.WEBSOCKET_URL || "",
  },

  // CONTRACT ADDRESSES
  contracts: {
    baseV1Factory: {
      addresses: ["0xF5C085044e5e86B61Ebd0fBE978aC6FCeeeD3F4f"],
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
        "0xE1764f6e5Cc49b3852DAE3801aDD1ADeb616B2b6", // CantoNoteLP
        "0x6E618CF8F4c267CD62f023C5175463C25414A9Cc", // cCantoNoteLP
        "0xa3aF7266388f394dd6EeA6132E01a251fb2dA888", // CantoAtomLP
        "0x675E38831e76f21DcAceE11a7bA3aE03d902A64e", // cCantoAtomLP
        "0xE297bA8e977a44F711566eCEd3195107e9379d8b", // NoteUSDCLP
        "0xE8b1295a5Ef143dfb031d87ECee54631D0C62406", // cNoteUSDCLP
        "0x1C7F0Ee20276B17DbD3cB2728Ae98fa47ecd4b46", // NoteUSDTLP
        "0xc38fBdA1E983542ba3d3d946678c311447Dc6B0D", // cNoteUSDTLP
        "0x72ebC7bD46789E04610bC360a07033db1e01274c", // CantoETHLP
        "0x7921d4853100ACF556cF5fE647015Abb6118C996", // cCantoETHLP
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
