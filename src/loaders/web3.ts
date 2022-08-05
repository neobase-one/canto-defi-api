import Web3 from "web3";
import { Config } from "../config";

export const web3 = new Web3(Config.jsonRpcUrl);
