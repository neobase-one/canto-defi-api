import Decimal from "decimal.js";

/*
- CToken Events
1. Borrow(address,uint256,uint256,uint256)
2. RepayBorrow(address,address,uint256,uint256,uint256)
3. LiquidateBorrow(address,address,uint256,address,uint256)
4. AccrueInterest(uint256,uint256,uint256,uint256)
5. NewReserveFactor(uint256,uint256)
6. Transfer(indexed address,indexed address,uint256)
7. NewMarketInterestRateModel(address,address)
*/

export class BorrowInput {
  borrower: string;
  borrowAmount: Decimal;
  accountBorrows: Decimal;
  totalBorrows: Decimal;

  constructor(eventObj: any) {
    this.borrower = eventObj[0];
    this.borrowAmount = new Decimal(eventObj[1]);
    this.accountBorrows = new Decimal(eventObj[2]);
    this.totalBorrows = new Decimal(eventObj[3]);
  }
}

export class RepayBorrowInput {
  payer: string;
  borrower: string;
  repayAmount: Decimal;
  accountBorrows: Decimal;
  totalBorrows: Decimal;

  constructor(eventObj: any) {
    this.payer = eventObj[0];
    this.borrower = eventObj[1];
    this.repayAmount = new Decimal(eventObj[2]);
    this.accountBorrows = new Decimal(eventObj[3]);
    this.totalBorrows = new Decimal(eventObj[4]);
  }
}

export class LiquidateBorrowInput {
  liquidator: string;
  borrower: string;
  repayAmount: Decimal;
  cTokenCollateral: string;
  seizeTokens: Decimal;

  constructor(eventObj: any) {
    this.liquidator = eventObj[0];
    this.borrower = eventObj[1];
    this.repayAmount = new Decimal(eventObj[2]);
    this.cTokenCollateral = eventObj[3];
    this.seizeTokens = new Decimal(eventObj[4]);
  }
}

export class AccrueInterestInput {
  cashPrior: Decimal;
  interestAccumulated: Decimal;
  borrowIndex: Decimal;
  totalBorrows: Decimal;

  constructor(eventObj: any) {
    this.cashPrior = new Decimal(eventObj[0]);
    this.interestAccumulated = new Decimal(eventObj[1]);
    this.borrowIndex = new Decimal(eventObj[2]);
    this.totalBorrows = new Decimal(eventObj[3]);
  }
}

export class NewReserveFactorInput {
  oldReserveFactorMantissa: Decimal;
  newReserveFactorMantissa: Decimal;

  constructor(eventObj: any) {
    this.oldReserveFactorMantissa = new Decimal(eventObj[0]);
    this.newReserveFactorMantissa = new Decimal(eventObj[1]);
  }
}

export class TransferInput {
  from: string;
  to: string;
  amount: Decimal;

  constructor(eventObj: any) {
    this.from = eventObj[0];
    this.to = eventObj[1];
    this.amount = new Decimal(eventObj[2]);
  }
}

export class NewMarketInterestRateModelInput {
  oldInterestRateModel: string;
  newInterestRateModel: string;
  
  constructor(eventObj: any) {
    this.oldInterestRateModel = eventObj[0];
    this.newInterestRateModel = eventObj[1];
  }
}
