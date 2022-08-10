import { isNullOrUndefined } from "@typegoose/typegoose/lib/internal/utils";
import Decimal from "decimal.js";
import { Arg, Query, Resolver } from "type-graphql";
import { StableswapFactory, StableswapFactoryModel } from "../../models/stableswapFactory";
import { UniswapFactoriesInput } from "./inputs/queryInputs";

@Resolver()
export class UniswapFactoriesResolver {
    @Query(returns => [StableswapFactory])
    async uniswapFactories(@Arg("input") input: UniswapFactoriesInput) {
        if (isNullOrUndefined(input.block)) {
            const val = await StableswapFactoryModel.find({ address: input.id }).exec();
            const result = val.map(factory => { return factory.toGenerated(); });
            return result;
        } else {
            const val = await StableswapFactoryModel.find({ address: input.id, block: new Decimal(input.block) }).exec();
            const result = val.map(factory => { return factory.toGenerated(); });
            return result;
        }
    }
}