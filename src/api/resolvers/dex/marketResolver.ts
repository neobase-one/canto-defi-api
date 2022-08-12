import { isNullOrUndefined } from "@typegoose/typegoose/lib/internal/utils";
import { Arg, Query, Resolver } from "type-graphql";
import { Market, MarketModel } from "../../../models/dex/market";
import { OrderDirection, MarketsInput, MarketInput } from "../inputs/queryInputs";

@Resolver()
export class MarketResolver {
    @Query(returns => [Market])
    async markets(@Arg("input") input: MarketsInput) {
        if (!isNullOrUndefined(input.id)) {
            let sortBy = input.orderBy;
            if (input.orderDirection === OrderDirection.DES) {
                sortBy = "-" + sortBy.trim;
            }
            const val = await MarketModel.find({ id: input.id }).sort(sortBy).exec();
            const result = val.map(market => { market.toGenerated() });
            return result;
        } else {
            let sortBy = input.orderBy;
            if (input.orderDirection === OrderDirection.DES) {
                sortBy = "-" + sortBy.trim;
            }
            let limit = input.first;
            if (input.skip !== 0) {
                limit = limit + input.skip;
            }
            const val = await MarketModel.find().sort(sortBy).limit(limit).exec();
            const result = val.slice(input.skip).map(market => { market.toGenerated() });
            return result;
        }
    }

    @Query(returns => Market)
    async market(@Arg("input") input: MarketInput) {
        const val = await MarketModel.findOne({id:input.id}).exec();
        return val?.toGenerated();
    }
}