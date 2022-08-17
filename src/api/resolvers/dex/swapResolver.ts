import { isNullOrUndefined } from "@typegoose/typegoose/lib/internal/utils";
import { Arg, Query, Resolver } from "type-graphql";
import { Swap, SwapDb, SwapModel } from "../../../models/dex/swap";
import { OrderDirection, SwapsInput } from "../inputs/queryInputs";

@Resolver()
export class SwapResolver {
    @Query(returns => [Swap])
    async swaps(@Arg("input") input: SwapsInput) {
        if (!isNullOrUndefined(input.pair_in)) {
            let sortBy = input.orderBy;
            if (input.orderDirection === OrderDirection.DES) {
                sortBy = "-" + sortBy.trim;
            }
            const val = await SwapModel.find({ pair: input.pair_in }).sort(sortBy).limit(input.first).exec();
            const result = await this.toGenerated(val as unknown as [SwapDb]);
            return result;
        } else if (!isNullOrUndefined(input.pair)) {
            const val = await SwapModel.find({ pair: input.pair }).exec();
            const result = await this.toGenerated(val as unknown as [SwapDb]);
            return result;
        } else {
            const val = await SwapModel.find().exec();
            const result = await this.toGenerated(val as unknown as [SwapDb]);
            return result;
        }

    }
    async toGenerated(swaps: [SwapDb]): Promise<Swap[]> {
        var result: Swap[] = [];
        for (var i = 0; i < swaps.length; i++) {
            var swap = await swaps[i].toGenerated();
            result.push(swap);
        }
        return result;
    }
}