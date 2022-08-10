import { isNullOrUndefined } from "@typegoose/typegoose/lib/internal/utils";
import Decimal from "decimal.js";
import { Arg, Query, Resolver } from "type-graphql";
import { StableswapFactoryModel } from "../../models/stableswapFactory";
import { UniswapFactory, UniswapFactoryModel } from "../../models/uniswapFactory";
import { UniswapFactoriesInput } from "./inputs/queryInputs";

@Resolver()
export class UniswapFactoriesResolver {
    @Query(returns => [UniswapFactory])
    async uniswapFactories(@Arg("input") input: UniswapFactoriesInput) {
        if (isNullOrUndefined(input.block)) {
            const val = await UniswapFactoryModel.find({ address: input.id}).exec();
            console.log(val);
            console.log("in single param search");
            return val;
        } else {
            const val = await StableswapFactoryModel.find({ address: input.id, block: new Decimal(input.block) }).exec();
            console.log(val);
            console.log("in double param search");
            return val;
        }
    }
}