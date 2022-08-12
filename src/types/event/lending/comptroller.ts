import Decimal from "decimal.js";

/*
- Comptroller Events
1. MarketEntered(address,address)
2. MarketExited(address,address)
3. NewCloseFactor(uint256,uint256)
4. NewCollateralFactor(address,uint256,uint256)
5. NewLiquidationIncentive(uint256,uint256)
6. NewMaxAssets(uint256,uint256) // not in the abi deployed
7. NewPriceOracle(address,address)
*/

export class MarketEnteredInput {
  cToken: string;
  account: string;

  constructor(eventObj: any) {
    this.cToken = eventObj[0];
    this.account = eventObj[1];
  }
}

export class MarketExitedInput {
  cToken: string;
  account: string;

  constructor(eventObj: any) {
    this.cToken = eventObj[0];
    this.account = eventObj[1];
  }
}

export class NewCloseFactorInput {
  oldCloseFactorMantissa: Decimal;
  newCloseFactorMantissa: Decimal;

  constructor(eventObj: any) {
    this.oldCloseFactorMantissa = new Decimal(eventObj[0]);
    this.newCloseFactorMantissa = new Decimal(eventObj[1]);
  }
}

export class NewCollateralFactorInput {
  cToken: string;
  oldCloseFactorMantissa: Decimal;
  newCloseFactorMantissa: Decimal;

  constructor(eventObj: any) {
    this.cToken = eventObj[0];
    this.oldCloseFactorMantissa = new Decimal(eventObj[1]);
    this.newCloseFactorMantissa = new Decimal(eventObj[2]);
  }
}

export class NewLiquidationIncentiveInput {
  oldLiquidationIncentiveMantissa: Decimal;
  newLiquidationIncentiveMantissa: Decimal;

  constructor(eventObj: any) {
    this.oldLiquidationIncentiveMantissa = new Decimal(eventObj[0]);
    this.newLiquidationIncentiveMantissa = new Decimal(eventObj[1]);
  }
}

export class NewPriceOracleInput {
  oldPriceOracle: string;
  newPriceOracle: string;

  constructor(eventObj: any) {
    this.oldPriceOracle = eventObj[0];
    this.newPriceOracle = eventObj[1];
  }
}
