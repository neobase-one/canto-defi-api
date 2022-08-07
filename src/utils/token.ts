import Decimal from "decimal.js"
import { TokenDefinition } from "./tokenDefinition"

export function fetchTokenSymbol(tokenAddress: string): string {
  // static definitions overrides
  let staticDefinition = TokenDefinition.fromAddress(tokenAddress)
  if(staticDefinition != null) {
    return (staticDefinition as TokenDefinition).symbol
  }
  
  return "";
}

export function fetchTokenName(tokenAddress: string): string {
  // static definitions overrides
  let staticDefinition = TokenDefinition.fromAddress(tokenAddress)
  if(staticDefinition != null) {
    return (staticDefinition as TokenDefinition).name
  }

  return "";
}

export function fetchTokenTotalSupply(tokenAddress: string): Decimal {
  // static definitions overrides
  let staticDefinition = TokenDefinition.fromAddress(tokenAddress)
  if(staticDefinition != null) {
    return (staticDefinition as TokenDefinition).totalSupply
  }

  return new Decimal("0");
}

export function fetchTokenDecimals(tokenAddress: string): number {
  // static definitions overrides
  let staticDefinition = TokenDefinition.fromAddress(tokenAddress)
  if(staticDefinition != null) {
    return (staticDefinition as TokenDefinition).decimals
  }

  return 0;
}