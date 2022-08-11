import { Arg, Query, Resolver } from "type-graphql";

import { Block, BlockModel } from "../../models/block";
import { BlocksInput, OrderDirection } from "./inputs/queryInputs";

@Resolver()
export class BlocksResolver {
    @Query(returns => [Block])
    async getBlocks(@Arg("input") input: BlocksInput) {
        let sortBy = input.orderBy;
        if (input.orderDirection === OrderDirection.DES) {
            sortBy = "-" + sortBy.trim;
        }
        const val = await BlockModel.find({ timestamp: { $gte: input.timestampFrom, $lte: input.timestampTo } }).sort(sortBy).limit(input.first).exec();
        console.log(val);
        return val;
    }
}