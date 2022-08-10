import { isNullOrUndefined } from "@typegoose/typegoose/lib/internal/utils";
import { Arg, Query, Resolver } from "type-graphql";
import { Burn, BurnModel } from "../../models/burn";
import { OrderDirection, BurnsInput } from "./inputs/queryInputs";

@Resolver()
export class BurnResolver {
    @Query(returns => [Burn])
    async burns(@Arg("input") input: BurnsInput) {
        if (!isNullOrUndefined(input.pair_in)) {
            let sortBy = input.orderBy;
            if (input.orderDirection === OrderDirection.DES) {
                sortBy = "-" + sortBy.trim;
            }
            const val = await BurnModel.find({ pair: input.pair_in }).sort(sortBy).limit(input.first).exec();
            const result = val.map(burn => { return burn.toGenerated(); });
            return result;
        } else {
            const val = await BurnModel.find({ to: input.to, pair: input.pair }).exec();
            const result = val.map(burn => { return burn.toGenerated(); });
            return result;
        }
    }
}