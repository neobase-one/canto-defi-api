import { Arg, Query, Resolver } from "type-graphql";
import { Swap, SwapModel } from "../../models/swap";
import { OrderDirection, SwapsInput } from "./inputs/queryInputs";

@Resolver()
export class SwapResolver {
    @Query(returns => [Swap])
    async swaps(@Arg("input") input: SwapsInput) {
        let sortBy = input.orderBy;
        if (input.orderDirection === OrderDirection.DES) {
            sortBy = "-" + sortBy.trim;
        }
        const val = await SwapModel.find({ pair: { pair: input.pair_in } }).sort(sortBy).limit(input.first).exec();
        const result = val.map(swap => { return swap.toGenerated(); });
        return result;
    }
}