import Decimal from "decimal.js";

export class TokenDefinition {
  address: string;
  symbol: string;
  name: string;
  totalSupply: Decimal;
  decimals: number;

  // Initialize a Token Definition with its attributes
  constructor(
    address: string,
    symbol: string,
    name: string,
    totalSupply: Decimal,
    decimals: number
  ) {
    this.address = address;
    this.symbol = symbol;
    this.name = name;
    this.totalSupply = totalSupply;
    this.decimals = decimals;
  }

  // Get all tokens with a static defintion
  // todo:
  static getStaticDefinitions(): Array<TokenDefinition> {
    let staticDefinitions = new Array<TokenDefinition>();

    // Add DGD
    let tokenDGD = new TokenDefinition(
      "0xe0b7927c4af23765cb51314a0e0521a9645f0e2a",
      "DGD",
      "DGD",
      new Decimal("0"),
      9
    );
    staticDefinitions.push(tokenDGD);

    return staticDefinitions;
  }

  // Helper for hardcoded tokens
  static fromAddress(tokenAddress: string): TokenDefinition | null {
    let staticDefinitions = this.getStaticDefinitions();

    // Search the definition using the address
    for (let i = 0; i < staticDefinitions.length; i++) {
      let staticDefinition = staticDefinitions[i];
      if (staticDefinition.address == tokenAddress) {
        return staticDefinition;
      }
    }

    // If not found, return null
    return null;
  }
}
