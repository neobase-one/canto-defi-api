import { isNullOrUndefined } from "@typegoose/typegoose/lib/internal/utils";
import { query } from "express";
import { Arg, Query, Resolver } from "type-graphql";
import { File } from "winston/lib/winston/transports";
import { Pair, PairModel } from "../../models/pair";
import { OrderDirection, PairInput } from "./inputs/queryInputs";

@Resolver()
export class PairsResolver {
    @Query(returns => [Pair])
    async getPairs(@Arg("input") input: PairInput) {
        let inputId: string | [string] | null = null;
        if (!isNullOrUndefined(input.id)) {
            inputId = input.id;
        } else {
            inputId = input.id_in;
        }
        let sortBy = input.orderBy;
        if (input.orderDirection === OrderDirection.DES) {
            sortBy = "-" + sortBy.trim;
        }
        var val;
        var filter: any = {};
        if (inputId) {
            filter.id = inputId;
        }
        if (input.block) {
            filter.createdAtBlockNumber = {$lte: input.block}
        }
        val = await PairModel.find(filter).sort(sortBy)
          .skip(input.skip).limit(input.first).exec();
        
        val = val.map(pair=>pair.toGenerated());
        return val;
    }
}