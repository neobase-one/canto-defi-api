import { Arg, Query, Resolver } from "type-graphql";
import { Burn, BurnModel } from "../../models/burn";
import { OrderDirection, BurnsInput } from "./inputs/queryInputs";

@Resolver()
export class BurnResolver {
    @Query(returns => [Burn])
    async burns(@Arg("input") input: BurnsInput) {
        let sortBy = input.orderBy;
        if (input.orderDirection === OrderDirection.DES) {
            sortBy = "-" + sortBy.trim;
        }
        const val = await BurnModel.find({ pair: { pair: input.pair_in } }).sort(sortBy).limit(input.first).exec();
        const result = val.map(burn => { return burn.toGenerated(); });
        return result;
    }
}