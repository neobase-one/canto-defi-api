import { Arg, Query, Resolver } from "type-graphql";
import { TokenDayData, TokenDayDataModel } from "../../models/tokenDayData";
import { UniswapDayData, UniswapDayDataModel } from "../../models/uniswapDayData";
import { UniswapDayDatasInput } from "./inputs/queryInputs";

@Resolver()
export class UniswapDayDatasResolver {
    @Query(returns => [UniswapDayData])
    async uniswapDayDatas(@Arg("input") input: UniswapDayDatasInput) {
        //fix service function
        const val = await UniswapDayDataModel.find({ date: { $gte: input.startTime } }).exec();
        console.log(val);
        return val;
    }
}