import { isNullOrUndefined } from "@typegoose/typegoose/lib/internal/utils";
import { Arg, Query, Resolver } from "type-graphql";
import { Mint, MintDb, MintModel } from "../../../models/dex/mint";
import { MintsInput, OrderDirection } from "../inputs/queryInputs";

@Resolver()
export class MintResolver {
    @Query(returns => [Mint])
    async mints(@Arg("input") input: MintsInput) {
        if (!isNullOrUndefined(input.pair_in)) {
            let sortBy = input.orderBy;
            if (input.orderDirection === OrderDirection.DES) {
                sortBy = "-" + sortBy.trim;
            }
            const val = await MintModel.find({ pair: input.pair_in }).sort(sortBy).limit(input.first).exec();
            const result = await this.toGenerated(val as unknown as [MintDb]);
            return result;
        } else if (!isNullOrUndefined(input.pair) && !isNullOrUndefined(input.to)) {
            const val = await MintModel.find({ to: input.to, pair: input.pair }).exec();
            const result = await this.toGenerated(val as unknown as [MintDb]);
            return result;
        } else if (!isNullOrUndefined(input.pair) && isNullOrUndefined(input.to)) {
            const val = await MintModel.find({ pair: input.pair }).exec();
            const result = await this.toGenerated(val as unknown as [MintDb]);
            return result;
        } else if (isNullOrUndefined(input.pair) && isNullOrUndefined(input.pair)) {
            const val = await MintModel.find().exec();
            const result = await this.toGenerated(val as unknown as [MintDb]);
            return result;
        }
    }

    async toGenerated(mints: [MintDb]): Promise<Mint[]> {
        var result: Mint[] = [];
        for (var i = 0; i < mints.length; i++) {
            var mint = await mints[i].toGenerated();
            result.push(mint);
        }
        return result;
    }
}