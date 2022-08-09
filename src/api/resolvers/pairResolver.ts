import { isNullOrUndefined } from "@typegoose/typegoose/lib/internal/utils";
import { Arg, Query, Resolver } from "type-graphql";
import { Pair, PairModel } from "../../models/pair";
import { OrderDirection, PairInput } from "./inputs/queryInputs";

@Resolver()
export class PairsResolver {
    @Query(returns => [Pair])
    async getPairs(@Arg("input") input: PairInput) {
        let inputId: string | [string];
        if (!isNullOrUndefined(input.id)) {
            inputId = input.id;
        } else {
            inputId = input.id_in;
        }
        let sortBy = input.orderBy;
        if (input.orderDirection === OrderDirection.DES) {
            sortBy = "-" + sortBy.trim;
        }
        const val = await PairModel.find({ id: inputId }).sort(sortBy).limit(input.first).exec();
        console.log(val);
        return val;
    }
}