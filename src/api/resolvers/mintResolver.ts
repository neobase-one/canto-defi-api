import { Arg, Query, Resolver } from "type-graphql";
import { Mint, MintModel } from "../../models/mint";
import { MintsInput, OrderDirection } from "./inputs/queryInputs";

@Resolver()
export class MintResolver {
    @Query(returns => [Mint])
    async mints(@Arg("input") input: MintsInput) {
        let sortBy = input.orderBy;
        if (input.orderDirection === OrderDirection.DES) {
            sortBy = "-" + sortBy.trim;
        }
        const val = await MintModel.find({ pair: { pair: input.pair_in } }).sort(sortBy).limit(input.first).exec();
        const result = val.map(mint => { return mint.toGenerated(); });
        return result;
    }
}