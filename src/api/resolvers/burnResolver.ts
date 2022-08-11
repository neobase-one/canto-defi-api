import { isNullOrUndefined } from "@typegoose/typegoose/lib/internal/utils";
import { Arg, Query, Resolver } from "type-graphql";
import { Burn, BurnDb, BurnModel } from "../../models/burn";
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
            const result = await this.toGenerated(val as unknown as [BurnDb]);
            return result;
        } else if (!isNullOrUndefined(input.pair) && !isNullOrUndefined(input.to)) {
            const val = await BurnModel.find({ to: input.to, pair: input.pair }).exec();
            const result = await this.toGenerated(val as unknown as [BurnDb]);
            return result;
        } else if (!isNullOrUndefined(input.pair) && isNullOrUndefined(input.to)) {
            const val = await BurnModel.find({ pair: input.pair }).exec();
            const result = await this.toGenerated(val as unknown as [BurnDb]);
            return result;
        } else if (isNullOrUndefined(input.pair) && isNullOrUndefined(input.pair)) {
            const val = await BurnModel.find().exec();
            const result = await this.toGenerated(val as unknown as [BurnDb]);
            return result;
        }
    }
    async toGenerated(burns: [BurnDb]): Promise<Burn[]> {
        var result: Burn[] = [];
        for (var i = 0; i < burns.length; i++) {
            var burn = await burns[i].toGenerated();
            result.push(burn);
        }
        return result;
    }
}