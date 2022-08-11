import Decimal from "decimal.js"
import { web3 } from "../loaders/web3";
import { Erc20ABI } from "./abiParser/erc20";
import { TokenDefinition } from "./tokenDefinition"

export async function fetchTokenSymbol(tokenAddress: string) {
  // static definitions overrides
  let staticDefinition = TokenDefinition.fromAddress(tokenAddress)
  if(staticDefinition != null) {
    return (staticDefinition as TokenDefinition).symbol
  }

  var contract = await new web3.eth.Contract(Erc20ABI, tokenAddress);
  var symbol = await contract.methods.symbol().call();
  if (symbol == null) {
    symbol = ""
  }
  
  return symbol;
}

export async function fetchTokenName(tokenAddress: string) {
  // static definitions overrides
  let staticDefinition = TokenDefinition.fromAddress(tokenAddress)
  if(staticDefinition != null) {
    return (staticDefinition as TokenDefinition).name
  }

  var contract = await new web3.eth.Contract(Erc20ABI, tokenAddress);
  var symbol = await contract.methods.symbol().call();
  if (symbol == null) {
    symbol = ""
  }

  return "";
}

export async function fetchTokenTotalSupply(tokenAddress: string) {
  // static definitions overrides
  let staticDefinition = TokenDefinition.fromAddress(tokenAddress)
  if(staticDefinition != null) {
    return (staticDefinition as TokenDefinition).totalSupply
  }

  var contract = await new web3.eth.Contract(Erc20ABI, tokenAddress);
  var totalSupply = await contract.methods.totalSupply().call();
  if (totalSupply == null) {
    totalSupply = 0;
  }

  return new Decimal(totalSupply.toString());
}

export function fetchTokenDecimals(tokenAddress: string): number {
  // static definitions overrides
  let staticDefinition = TokenDefinition.fromAddress(tokenAddress)
  if(staticDefinition != null) {
    return (staticDefinition as TokenDefinition).decimals
  }

  return 18;
}