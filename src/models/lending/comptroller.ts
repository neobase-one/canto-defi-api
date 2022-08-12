import { getModelForClass, Prop as Property } from "@typegoose/typegoose";
import { ObjectId } from "mongodb";
import { Field, ObjectType, ID } from "type-graphql";
import { DecimalScalar } from "../../types/decimalScalar";
import Decimal from "decimal.js";
import { ZERO_BD } from "../../utils/constants";
import { ObjectIdScalar } from "../../types/objectIdScalar";

// mongo database object
export class ComptrollerDb {
    readonly _id: ObjectId;

    // decorator docs: https://typegoose.github.io/typegoose/docs/api/decorators/prop
    @Property({ name: "id", default: "1", required: false })
    id: string;

    @Property({ name: "priceOracle", required: false })
    priceOracle: string

    @Property({ name: "closeFactor", required: false })
    closeFactor: Decimal

    @Property({ name: "liquidationIncentive", required: false })
    liquidationIncentive: Decimal

    @Property({ name: "maxAssets", required: false })
    maxAssets: Decimal

    constructor(id: string) {
        this._id = new ObjectId();
        this.id = id;
        this.priceOracle = "";
        this.closeFactor = ZERO_BD;
        this.liquidationIncentive = ZERO_BD;
        this.maxAssets = ZERO_BD;
    }

    toGenerated() {
        var b = new Comptroller()
        return b.fromDb(this);
    }
}

// graphql return object (type Block as shown in schema.ts)
// decorator docs: https://typegraphql.com/docs/types-and-fields.html 
@ObjectType()
export class Comptroller {
    @Field((type) => ObjectIdScalar)
    _id: ObjectId;

    @Field((type) => ID)
    id: string;

    @Field((type) => String)
    priceOracle: string

    @Field((type) => DecimalScalar)
    closeFactor: Decimal

    @Field((type) => DecimalScalar)
    liquidationIncentive: Decimal

    @Field((type) => DecimalScalar)
    maxAssets: Decimal

    constructor() {
        this._id = new ObjectId();
        this.id = "";
        this.priceOracle = "";
        this.closeFactor = ZERO_BD;
        this.liquidationIncentive = ZERO_BD;
        this.maxAssets = ZERO_BD;
    }

    fromDb(comptroller: ComptrollerDb) {
        this._id = comptroller._id;
        this.id = comptroller.id;
        this.priceOracle = comptroller.priceOracle;
        this.closeFactor = comptroller.closeFactor;
        this.liquidationIncentive = comptroller.liquidationIncentive;
        this.maxAssets = comptroller.maxAssets;
        return this;
    }

    justId(id: string) {
        this.id = id;
    }
}

export const ComptrollerModel = getModelForClass(ComptrollerDb);