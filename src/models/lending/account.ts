import { getModelForClass, Prop as Property } from "@typegoose/typegoose";
import Decimal from "decimal.js";
import { ObjectId } from "mongodb";
import { Field, ID, ObjectType } from "type-graphql";
import { DecimalScalar } from "../../types/decimalScalar";
import { ObjectIdScalar } from "../../types/objectIdScalar";

import { ZERO_BD } from "../../utils/constants";
import { AccountCToken } from "./accountCToken";

// db object
export class AccountDb {

    @Property({ default: "", required: false })
    readonly _id: ObjectId;

    @Property({ default: "", required: true })
    id: string;

    @Property({ type: String, default: [], required: false })
    tokens: string[]

    @Property({ default: new Decimal("0"), required: false })
    countLiquidated: Decimal;

    @Property({ default: new Decimal("0"), required: false })
    liquidityTokenBalance: Decimal;

    @Property({ default: new Decimal("0"), required: false })
    countLiquidator: Decimal

    @Property({ default: false, required: false })
    hasBorrowed: Boolean

    //   # The following values are added by the JS Wrapper, and must be calculated with the most up
    //   # to date values based on the block delta for market.exchangeRate and market.borrowIndex
    //   # They do not need to be in the schema, but they will show up in the explorer playground

    //   # "If less than 1, the account can be liquidated
    //   # health: BigDecimal!
    //   # "Total assets supplied by user"
    //   # totalBorrowValueInEth: BigDecimal!
    //   # "Total assets borrowed from user"
    //   # totalCollateralValueInEth: BigDecimal!

    constructor(id: string) {
        this._id = new ObjectId();
        this.id = id;
        this.countLiquidated = ZERO_BD;
        this.liquidityTokenBalance = ZERO_BD;
        this.countLiquidator = ZERO_BD;
        this.hasBorrowed = false;
    }

    toGenerated() {
        var a = new Account()
        return a.fromDb(this);
    }
}


export const AccountModel = getModelForClass(AccountDb);

// graphql type
@ObjectType()
export class Account {
    @Field((type) => ObjectIdScalar)
    _id: ObjectId;

    @Field((type) => ID)
    id: string;

    @Field((type) => [AccountCToken])
    tokens: [AccountCToken]

    @Field((type) => DecimalScalar)
    countLiquidated: Decimal;

    @Field((type) => DecimalScalar)
    liquidityTokenBalance: Decimal;

    @Field((type) => DecimalScalar)
    countLiquidator: Decimal

    @Field((type) => Boolean)
    hasBorrowed: Boolean

    constructor() {
        this._id = new ObjectId();
        this.id = "";
        this.countLiquidated = ZERO_BD;
        this.liquidityTokenBalance = ZERO_BD;
        this.countLiquidator = ZERO_BD;
        this.hasBorrowed = false;
    }

    fromDb(account: AccountDb) {
        this._id = account._id
        this.id = account.id;
        this.tokens = getTokens(this.tokens);
        this.countLiquidated = account.countLiquidated;
        this.liquidityTokenBalance = account.liquidityTokenBalance;
        this.countLiquidator = account.countLiquidator;
        this.hasBorrowed = false;
        return this;
    }

    justId(id: string) {
        this.id = id;
    }
}
function getTokens(tokens: [AccountCToken]): [AccountCToken] {
    //ToDo : field resolvers

    throw new Error("Function not implemented.");
}

