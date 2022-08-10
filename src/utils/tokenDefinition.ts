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

    // Add Note
    let tokenNote = new TokenDefinition(
      "0x9b195c7cb901cbb5a44776cd09031f66ec033627",
      "NOTE",
      "Note",
      new Decimal("115792089237316195423570985008687907853269984665640564039457584007913129639935"),
      18
    );
    staticDefinitions.push(tokenNote);

    // Add USDC
    let tokenUsdc = new TokenDefinition(
      "0x88f0a187d4c33f7e18eb2871cab382ab895e32db",
      "USDC",
      "USDC",
      new Decimal("9000000000000000000000"),
      6
    );
    staticDefinitions.push(tokenUsdc);

    // Add USDT
    let tokenUsdt = new TokenDefinition(
      "0xddf962eba787aa11d5a69b6dc1ff8a8a50be825c",
      "USDT",
      "USDT",
      new Decimal("9000000000000000000000"),
      6
    );
    staticDefinitions.push(tokenUsdt);

    // Add ATOM
    let tokenAtom = new TokenDefinition(
      "0xb6427565344049b54bf591d72e08f67cf095c5ef",
      "ATOM",
      "ATOM",
      new Decimal("900000000000000000000000"),
      8
    );
    staticDefinitions.push(tokenAtom);

    // Add ETH
    let tokenEth = new TokenDefinition(
      "0xec98e09d49b5990f366a71fae85e2e86923ee49b",
      "ETH",
      "ETH",
      new Decimal("9000000000000000000000000000000000"),
      18
    );
    staticDefinitions.push(tokenEth);

    // Add WETH
    let tokenWeth = new TokenDefinition(
      "0x9d840713d7817f519f2ebb33470fb50fb86ac195",
      "WETH",
      "WETH",
      new Decimal("50923228985519684645752"),
      18
    );
    staticDefinitions.push(tokenWeth);


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
