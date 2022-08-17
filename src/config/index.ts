import Decimal from "decimal.js";
import dotenv from "dotenv";
import Web3 from "web3";
import { PairCreatedEventSignature } from "../utils/abiParser/baseV1factory";
import {
  BurnEventSignature,
  MintEventSignature,
  SwapEventSignature,
  SyncEventSignature,
  TransferEventSignature
} from "../utils/abiParser/baseV1Pair";
import { MarketEnteredEventSignature, MarketExitedEventSignature, NewCloseFactorEventSignature, NewCollateralFactorEventSignature, NewLiquidationIncentiveEventSignature, NewPriceOracleEventSignature } from "../utils/abiParser/comptroller";
import { AccrueInterestEventSignature, BorrowEventSignature, LiquidateBorrowEventSignature, NewMarketInterestRateModelEventSignature, NewReserveFactorEventSignature, RepayBorrowEventSignature } from "../utils/abiParser/ctoken";

// load env var
dotenv.config();

// default -> NODE_ENV: development
process.env.NODE_ENV = process.env.NODE_ENV || "development";

export const Config = {
  // server port
  port: parseInt(process.env.PORT || "8080"),

  indexer: {
    index: process.env.INDEX || "FALSE", // TRUE or FALSE
    startBlock: parseInt(process.env.START_BLOCK || "0")
  },

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
    BLOCK_TIME: 5, // in seconds
    rpcBlockRange: parseInt(process.env.MAX_BLOCK_RANGE || "5000"),
    websocketUrl: process.env.WEBSOCKET_URL || "",
    // stableswap dash needs all these
    dexDashboard: {
      wCANTO_ADDRESS: "0x826551890Dc65655a0Aceca109aB11AbDbD7a07B", //wCANTO
      NOTE_CANTO_PAIR: "0x1D20635535307208919f0b67c3B2065965A85aA9", // token1 = wCANTO
      CANTO_ETH_PAIR: "0x216400ba362d8FCE640085755e47075109718C8B", // token1 = wCANTO
      CANTO_ATOM_PAIR: "0x30838619C55B787BafC3A4cD9aEa851C1cfB7b19", // token0 = wCANTO
      NOTE_USDC_PAIR: "0x9571997a66D63958e1B3De9647C22bD6b9e7228c", // token1 = USDC
      NOTE_USDT_PAIR: "0x35DB1f3a6A6F07f82C76fCC415dB6cFB1a7df833", // token1 = USDT
      // token where amounts should contribute to tracked volume and liquidity
      WHITELIST: [
        "0x4e71A2E537B7f9D9413D3991D37958c0b5e1e503", // NOTE
        "0x80b5a32E4F032B2a058b4F29EC95EEfEEB87aDcd", // USDC
        "0xd567B3d7B8FE3C79a1AD8dA978812cfC4Fa05e75", // USDT
        "0xecEEEfCEE421D8062EF8d6b4D814efe4dc898265", // ATOM
        "0x5FD55A1B9FC24967C4dB09C513C3BA0DFa7FF687", // ETH
        "0x826551890Dc65655a0Aceca109aB11AbDbD7a07B", // wCANTO
      ],
      UNTRACKED_PAIRS: [
      ],
      // minimum liquidity required to count towards tracked volume for pairs with small # of Lps
      MINIMUM_USD_THRESHOLD_NEW_PAIRS: new Decimal("400"),
      // minimum liquidity for price to get tracked
      MINIMUM_LIQUIDITY_THRESHOLD_CANTO: new Decimal("2"),

    },
    // lending dash needs all these
    lendingDashboard: {
      // "0x8c1D2b6b650a85aBC1c033580e88DD5d9D9aC40A", // cNoteDelegator
      // "0x0dD6241bFE519fB1c1B654877b66311c355804c5", // cUsdcDelegator
      // "0xD7Ff6Ba11422D47Aeff3DAE08CC1Ff5F30975D80", // cUsdtDelegator
      // "0x732Dcd6021fE992a935a26A6C5861312f0cBE5B2", // cAtomDelegator
      // "0x830b9849E7D79B92408a86A557e7baAACBeC6030", // cEthDelegator
      // "0xB65Ec550ff356EcA6150F733bA9B954b2e0Ca488", // cCanto
      USDC_ADDRESS: "0x80b5a32E4F032B2a058b4F29EC95EEfEEB87aDcd",
      cUSDC_ADDRESS: "0x0dD6241bFE519fB1c1B654877b66311c355804c5",
      cETH_ADDRESS: "0x830b9849E7D79B92408a86A557e7baAACBeC6030",
      MANTISSA_FACTOR: 18,
      cTOKEN_DECIMALS: 8
    }
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
    comptroller: {
      addresses: ["0x6F64C2a8c8417fF18CED8782cCA7125E52dF31B4"],
      events: {
        marketEntered: {
          signature: Web3.utils.keccak256(MarketEnteredEventSignature),
        },
        marketExited: {
          signature: Web3.utils.keccak256(MarketExitedEventSignature),
        },
        newCloseFactor: {
          signature: Web3.utils.keccak256(NewCloseFactorEventSignature),
        },
        newCollateralFactor: {
          signature: Web3.utils.keccak256(NewCollateralFactorEventSignature),
        },
        newLiquidationIncentive: {
          signature: Web3.utils.keccak256(NewLiquidationIncentiveEventSignature),
        },
        newPriceOracle: {
          signature: Web3.utils.keccak256(NewPriceOracleEventSignature)
        },
        options: {
          signatures: [
            Web3.utils.keccak256(MarketEnteredEventSignature),
            Web3.utils.keccak256(MarketExitedEventSignature),
            Web3.utils.keccak256(NewCloseFactorEventSignature),
            Web3.utils.keccak256(NewCollateralFactorEventSignature),
            Web3.utils.keccak256(NewLiquidationIncentiveEventSignature),
            Web3.utils.keccak256(NewPriceOracleEventSignature),
          ]
        }
      }
    },
    cToken: {
      addresses: [
        "0x8c1D2b6b650a85aBC1c033580e88DD5d9D9aC40A", // cNoteDelegator
        "0x0dD6241bFE519fB1c1B654877b66311c355804c5", // cUsdcDelegator
        "0xD7Ff6Ba11422D47Aeff3DAE08CC1Ff5F30975D80", // cUsdtDelegator
        "0x732Dcd6021fE992a935a26A6C5861312f0cBE5B2", // cAtomDelegator
        "0x830b9849E7D79B92408a86A557e7baAACBeC6030", // cEthDelegator
        "0xB65Ec550ff356EcA6150F733bA9B954b2e0Ca488", // cCanto
      ],
      events: {
        borrow: {
          signature: Web3.utils.keccak256(BorrowEventSignature),
        },
        repayBorrow: {
          signature: Web3.utils.keccak256(RepayBorrowEventSignature),
        },
        liquidateBorrow: {
          signature: Web3.utils.keccak256(LiquidateBorrowEventSignature),
        },
        accrueInterest: {
          signature: Web3.utils.keccak256(AccrueInterestEventSignature),
        },
        newReserveFactor: {
          signature: Web3.utils.keccak256(NewReserveFactorEventSignature),
        },
        transfer: {
          signature: Web3.utils.keccak256(TransferEventSignature),
        },
        newMarketInterestRateModel: {
          signature: Web3.utils.keccak256(NewMarketInterestRateModelEventSignature),
        },
        options: {
          signatures: [
            Web3.utils.keccak256(BorrowEventSignature),
            Web3.utils.keccak256(RepayBorrowEventSignature),
            Web3.utils.keccak256(LiquidateBorrowEventSignature),
            Web3.utils.keccak256(AccrueInterestEventSignature),
            Web3.utils.keccak256(NewReserveFactorEventSignature),
            Web3.utils.keccak256(TransferEventSignature),
            Web3.utils.keccak256(NewMarketInterestRateModelEventSignature),
          ]
        }
      }
    },
    baseV1Router: {
      addresses: ["0x8fa61F21Fb514d2914a48B29810900Da876E295b"]
    }
  },
};
