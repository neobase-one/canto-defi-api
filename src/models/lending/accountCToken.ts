import { getModelForClass, Prop as Property } from "@typegoose/typegoose";
import Decimal from "decimal.js";
import { ObjectId } from "mongodb";
import { Field, ID, ObjectType } from "type-graphql";
import { DecimalScalar } from "../../types/decimalScalar";
import { ObjectIdScalar } from "../../types/objectIdScalar";
import { ZERO_BD } from "../../utils/constants";
import { Account } from "./account";
import { Market } from "./market";

// db object
export class AccountCTokenDb {
    @Property({ default: new ObjectId(), required: true })
    _id: ObjectId;

    @Property({ default: "", required: true })
    id: string;

    @Property({ default: "", required: false })
    market: string

    @Property({ default: "", required: false })
    symbol: string

    @Property({ default: "", required: false })
    account: string

    @Property({ type: String, default: [], required: false })
    transactionHashes: string[]

    @Property({ type: Decimal, default: [], required: false })
    transactionTimes: Decimal[]

    @Property({ default: new Decimal("0"), required: false })
    accrualBlockNumber: Decimal

    @Property({ default: false, required: false })
    enteredMarket: Boolean

    @Property({ default: new Decimal("0"), required: false })
    cTokenBalance: Decimal

    @Property({ default: new Decimal("0"), required: false })
    totalUnderlyingSupplied: Decimal

    @Property({ default: new Decimal("0"), required: false })
    totalUnderlyingRedeemed: Decimal

    @Property({ default: new Decimal("0"), required: false })
    accountBorrowIndex: Decimal

    @Property({ default: new Decimal("0"), required: false })
    totalUnderlyingBorrowed: Decimal

    @Property({ default: new Decimal("0"), required: false })
    totalUnderlyingRepaid: Decimal

    @Property({ default: new Decimal("0"), required: false })
    storedBorrowBalance: Decimal

    //   # The following values are added by the JS Wrapper, and must be calculated with the most up
    //   # to date values based on the block delta for market.exchangeRate and market.borrowIndex
    //   # They do not need to be in the schema, but they will show up in the explorer playground

    //   # supplyBalanceUnderlying: BigDecimal!
    //   # FORMULA: supplyBalanceUnderlying = cTokenBalance * market.exchangeRate

    //   # lifetimeSupplyInterestAccrued: BigDecimal!
    //   # FORMULA: lifetimeSupplyInterestAccrued = supplyBalanceUnderlying - totalUnderlyingSupplied + totalUnderlyingRedeemed

    //   # borrowBalanceUnderlying: BigDecimal!
    //   # FORMULA: borrowBalanceUnderlying = storedBorrowBalance * market.borrowIndex / accountBorrowIndex

    //   # lifetimeBorrowInterestAccrued: BigDecimal!
    //   # FORMULA: lifetimeBorrowInterestAccrued = borrowBalanceUnderlying - totalUnderlyingBorrowed + totalUnderlyingRepaid

    constructor(id: string) {
        this._id = new ObjectId();
        this.id = id;
        this.market = "";
        this.symbol = "";
        this.account = "";
        this.accrualBlockNumber = ZERO_BD;
        this.enteredMarket = false;
        this.cTokenBalance = ZERO_BD;
        this.totalUnderlyingSupplied = ZERO_BD;
        this.totalUnderlyingRedeemed = ZERO_BD;
        this.accountBorrowIndex = ZERO_BD;
        this.totalUnderlyingBorrowed = ZERO_BD;
        this.totalUnderlyingRepaid = ZERO_BD;
        this.storedBorrowBalance = ZERO_BD;
    }

    toGenerated() {
        var l = new AccountCToken()
        return l.fromDb(this);
    }
}


export const AccountCTokenModel = getModelForClass(AccountCTokenDb);

// graphql type
@ObjectType()
export class AccountCToken {
    @Field((type) => ObjectIdScalar)
    _id: ObjectId;

    @Field((type) => ID)
    id: string;

    @Field((type) => Market)
    market: Market

    @Field((type) => String)
    symbol: string

    @Field((type) => Account)
    account: Account

    @Field((type) => [String])
    transactionHashes: [string]

    @Field((type) => [DecimalScalar])
    transactionTimes: [Decimal]

    @Field((type) => DecimalScalar)
    accrualBlockNumber: Decimal

    @Field((type) => Boolean)
    enteredMarket: Boolean

    @Field((type) => DecimalScalar)
    cTokenBalance: Decimal

    @Field((type) => DecimalScalar)
    totalUnderlyingSupplied: Decimal

    @Field((type) => DecimalScalar)
    totalUnderlyingRedeemed: Decimal

    @Field((type) => DecimalScalar)
    accountBorrowIndex: Decimal

    @Field((type) => DecimalScalar)
    totalUnderlyingBorrowed: Decimal

    @Field((type) => DecimalScalar)
    totalUnderlyingRepaid: Decimal

    @Field((type) => DecimalScalar)
    storedBorrowBalance: Decimal

    constructor() {
        this._id = new ObjectId();
        this.id = "";
        this.market = new Market();
        this.symbol = "";
        this.account = new Account;
        this.accrualBlockNumber = ZERO_BD;
        this.enteredMarket = false;
        this.cTokenBalance = ZERO_BD;
        this.totalUnderlyingSupplied = ZERO_BD;
        this.totalUnderlyingRedeemed = ZERO_BD;
        this.accountBorrowIndex = ZERO_BD;
        this.totalUnderlyingBorrowed = ZERO_BD;
        this.totalUnderlyingRepaid = ZERO_BD;
        this.storedBorrowBalance = ZERO_BD;
    }

    fromDb(accountCToken: AccountCTokenDb) {
        this._id = accountCToken._id
        this.id = accountCToken.id;
        this.market = getMarket(accountCToken.market);
        this.symbol = "";
        this.account = getAccount(accountCToken.account);
        this.accrualBlockNumber = accountCToken.accrualBlockNumber;
        this.enteredMarket = accountCToken.enteredMarket;
        this.cTokenBalance = accountCToken.cTokenBalance;
        this.totalUnderlyingSupplied = accountCToken.totalUnderlyingSupplied;
        this.totalUnderlyingRedeemed = accountCToken.totalUnderlyingRedeemed;
        this.accountBorrowIndex = accountCToken.accountBorrowIndex;
        this.totalUnderlyingBorrowed = accountCToken.totalUnderlyingBorrowed;
        this.totalUnderlyingRepaid = accountCToken.totalUnderlyingRepaid;
        this.storedBorrowBalance = accountCToken.storedBorrowBalance;
        return this;
    }

    justId(id: string) {
        this.id = id;
    }
}
function getMarket(market: string): Market {
    //ToDo : field resolvers
    throw new Error("Function not implemented.");

}

function getAccount(account: string): Account {
    //ToDo : field resolvers
    throw new Error("Function not implemented.");
}

