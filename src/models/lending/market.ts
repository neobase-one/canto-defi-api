import { getModelForClass, Prop as Property } from "@typegoose/typegoose";
import { ObjectId } from "mongodb";
import { ObjectType, Field, ID } from "type-graphql";
import { DecimalScalar } from "../../types/decimalScalar";
import Decimal from "decimal.js";
import { ObjectIdScalar } from "../../types/objectIdScalar";
import { ZERO_BD } from "../../utils/constants";

// mongo database object
export class MarketDb {
    readonly _id: ObjectId;

    @Property({ default: "", required: false })
    id: string;
    @Property({ default: "", required: false })
    name: string;
    @Property({ default: "", required: false })
    symbol: string;
    @Property({ default: new Decimal("0"), required: false })
    accrualBlockNumber: Decimal;
    @Property({ required: false })
    totalSupply: Decimal;
    @Property({ required: false })
    exchangeRate: Decimal;
    @Property({ default: new Decimal("0"), required: false })
    totalReserves: Decimal;
    @Property({ default: new Decimal("0"), required: false })
    totalCash: Decimal;
    @Property({ default: new Decimal("0"), required: false })
    totalDeposits: Decimal;
    @Property({ default: new Decimal("0"), required: false })
    totalBorrows: Decimal;
    @Property({ default: new Decimal("0"), required: false })
    perBlockBorrowInterest: Decimal;
    @Property({ default: new Decimal("0"), required: false })
    perBlockSupplyInterest: Decimal;
    @Property({ default: new Decimal("0"), required: false })
    borrowIndex: Decimal;
    @Property({ default: new Decimal("0"), required: false })
    tokenPerEthRatio: Decimal;
    @Property({ default: new Decimal("0"), required: false })
    tokenPerUSDRatio: Decimal;
    @Property({ default: new Decimal("0"), required: false })
    borrowRate: Decimal;
    @Property({ default: new Decimal("0"), required: false })
    collateralFactor: Decimal;
    @Property({ default: "", required: false })
    interestRateModelAddress: string
    @Property({ default: new Decimal("0"), required: false })
    numberOfBorrowers: Decimal;
    @Property({ default: new Decimal("0"), required: false })
    numberOfSuppliers: Decimal;
    @Property({ default: new Decimal("0"), required: false })
    supplyRate: Decimal;
    @Property({ default: "", required: false })
    underlyingAddress: string
    @Property({ default: "", required: false })
    underlyingName: string
    @Property({ default: new Decimal("0"), required: false })
    underlyingPrice: Decimal;
    @Property({ default: "", required: false })
    underlyingSymbol: string;
    @Property({ default: new Decimal("0"), required: false })
    blockTimestamp: Decimal;
    @Property({ default: new Decimal("0"), required: false })
    reserveFactor: Decimal;
    @Property({ default: new Decimal("0"), required: false })
    underlyingPriceUSD: Decimal;
    @Property({ default: new Decimal("0"), required: false })
    underlyingDecimals: Decimal;

    constructor(id: string) {
        this._id = new ObjectId();
        this.id = id;
        this.symbol = "";
        this.accrualBlockNumber = ZERO_BD;
        this.totalSupply = ZERO_BD;
        this.exchangeRate = ZERO_BD;
        this.totalReserves = ZERO_BD;
        this.totalCash = ZERO_BD;
        this.totalDeposits = ZERO_BD;
        this.totalBorrows = ZERO_BD;
        this.perBlockBorrowInterest = ZERO_BD;
        this.perBlockSupplyInterest = ZERO_BD;
        this.borrowIndex = ZERO_BD;
        this.tokenPerEthRatio = ZERO_BD;
        this.tokenPerUSDRatio = ZERO_BD;
    }

    toGenerated() {
        var m = new Market();
        return m.fromDb(this);
    }
}

export const MarketModel = getModelForClass(MarketDb);

// graphql return object (type Block as shown in schema.ts)
// decorator docs: https://typegraphql.com/docs/types-and-fields.html 
@ObjectType()
export class Market {
    @Field((type) => ObjectIdScalar)
    _id: ObjectId;

    @Field((type) => ID)
    id: string;

    @Field((type) => String)
    symbol: string;

    @Field((type) => DecimalScalar)
    accrualBlockNumber: Decimal;

    @Field((type) => DecimalScalar)
    totalSupply: Decimal;

    @Field((type) => DecimalScalar)
    exchangeRate: Decimal;

    @Field((type) => DecimalScalar)
    totalReserves: Decimal;

    @Field((type) => DecimalScalar)
    totalCash: Decimal;

    @Field((type) => DecimalScalar)
    totalDeposits: Decimal;

    @Field((type) => DecimalScalar)
    totalBorrows: Decimal;

    @Field((type) => DecimalScalar)
    perBlockBorrowInterest: Decimal;

    @Field((type) => DecimalScalar)
    perBlockSupplyInterest: Decimal;

    @Field((type) => DecimalScalar)
    borrowIndex: Decimal;

    @Field((type) => DecimalScalar)
    tokenPerEthRatio: Decimal;

    @Field((type) => DecimalScalar)
    tokenPerUSDRatio: Decimal;

    constructor() {
        this._id = new ObjectId();
        this.id = "";
        this.symbol = "";
        this.accrualBlockNumber = ZERO_BD;
        this.totalSupply = ZERO_BD;
        this.exchangeRate = ZERO_BD;
        this.totalReserves = ZERO_BD;
        this.totalCash = ZERO_BD;
        this.totalDeposits = ZERO_BD;
        this.totalBorrows = ZERO_BD;
        this.perBlockBorrowInterest = ZERO_BD;
        this.perBlockSupplyInterest = ZERO_BD;
        this.borrowIndex = ZERO_BD;
        this.tokenPerEthRatio = ZERO_BD;
        this.tokenPerUSDRatio = ZERO_BD;
    }

    async fromDb(mdb: MarketDb) {
        this._id = mdb._id;
        this.id = mdb.id;
        this.symbol = mdb.symbol;
        this.accrualBlockNumber = mdb.accrualBlockNumber;
        this.totalSupply = mdb.totalSupply;
        this.exchangeRate = mdb.exchangeRate;
        this.totalReserves = mdb.totalReserves;
        this.totalCash = mdb.totalCash;
        this.totalDeposits = mdb.totalDeposits;
        this.totalBorrows = mdb.totalBorrows;
        this.perBlockBorrowInterest = mdb.perBlockBorrowInterest;
        this.perBlockSupplyInterest = mdb.perBlockSupplyInterest;
        this.borrowIndex = mdb.borrowIndex;
        this.tokenPerEthRatio = mdb.tokenPerEthRatio;
        this.tokenPerUSDRatio = mdb.tokenPerUSDRatio;
        return this;
    }

    justId(id: string) {
        this.id = id;
    }
}