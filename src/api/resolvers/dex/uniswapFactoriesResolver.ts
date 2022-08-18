import { isNullOrUndefined } from "@typegoose/typegoose/lib/internal/utils";
import Decimal from "decimal.js";
import { Arg, Query, Resolver } from "type-graphql";
import { StableswapFactory, StableswapFactoryModel } from "../../../models/dex/stableswapFactory";
import { UniswapFactoriesInput } from "../inputs/queryInputs";

@Resolver()
export class UniswapFactoriesResolver {
    @Query(returns => [StableswapFactory])
    async uniswapFactories(@Arg("input") input: UniswapFactoriesInput) {
        if (isNullOrUndefined(input.block)) {
            const val = await StableswapFactoryModel.find({ address: input.id }).exec();
            return val;
            // const result = val.map(factory => { return factory.toGenerated(); });
            // return result;
        } else {
            const val = await StableswapFactoryModel.find({ address: input.id, block: { $lte: new Decimal(input.block) } }).exec();
            return val;
            // const result = val.map(factory => { return factory.toGenerated(); });
            // return result;
        }
    }
}