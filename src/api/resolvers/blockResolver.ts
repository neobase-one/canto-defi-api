import { Arg, Query, Resolver } from "type-graphql";
import { Block, BlockModel } from "../../models/block";
import { BlocksInput} from "./inputs/queryInputs";

@Resolver()
export class BlocksResolver {
    @Query(returns => [Block])
    async getBlocks(@Arg("input") input: BlocksInput) {
        const val = await BlockModel.find({ timestamp: { $gte: input.timestampFrom, $lte: input.timestampTo } }).exec();
        console.log(val);
        return val;
    }
}