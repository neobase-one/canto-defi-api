import { getModelForClass, Prop as Property } from "@typegoose/typegoose";
import Decimal from "decimal.js";
import { ObjectId } from "mongodb";
import { Field, ID, ObjectType } from "type-graphql";
import { DecimalScalar } from "../../types/decimalScalar";
import { ObjectIdScalar } from "../../types/objectIdScalar";
import { ZERO_BD } from "../../utils/constants";

// mongo database object
export class ComptrollerDb {
    @Property({ default: new ObjectId(), required: true })
    _id: ObjectId;

    // decorator docs: https://typegoose.github.io/typegoose/docs/api/decorators/prop
    @Property({ name: "id", default: "1", required: true })
    id: string;

    @Property({ name: "priceOracle", default: "", required: false })
    priceOracle: string

    @Property({ name: "closeFactor", default: new Decimal("0"), required: false })
    closeFactor: Decimal

    @Property({ name: "liquidationIncentive", default: new Decimal("0"), required: false })
    liquidationIncentive: Decimal

    @Property({ name: "maxAssets", default: new Decimal("0"), required: false })
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