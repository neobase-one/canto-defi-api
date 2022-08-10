import { Arg, Query, Resolver } from "type-graphql";
import { StableswapDayData, StableswapDayDataModel } from "../../models/stableswapDayData";
import { UniswapDayData, UniswapDayDataModel } from "../../models/uniswapDayData";
import { OrderDirection, UniswapDayDatasInput } from "./inputs/queryInputs";

@Resolver()
export class UniswapDayDatasResolver {
    @Query(returns => [UniswapDayData])
    async uniswapDayDatas(@Arg("input") input: UniswapDayDatasInput) {
        let limit = input.first;
        if (input.skip !== 0) {
            limit = limit + input.skip;
        }
        let sortBy = input.orderBy;
        if (input.orderDirection === OrderDirection.DES) {
            sortBy = "-" + sortBy.trim;
        }
        let val = await StableswapDayDataModel.find({ date: { $gte: input.startTime } }).sort(sortBy).limit(limit).exec();
        console.log(val);
        val = val.slice(input.skip);
        return val;
    }
}