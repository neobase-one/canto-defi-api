import { isNullOrUndefined } from "@typegoose/typegoose/lib/internal/utils";
import { Arg, Query, Resolver } from "type-graphql";
import { Token, TokenModel } from "../../../models/dex/token";
import { TokenInput } from "../inputs/queryInputs";

@Resolver()
export class TokensResolver {
    @Query(returns => [Token])
    async tokens(@Arg("input") input: TokenInput) {
        let inputId: string | [string];
        let limit: number;
        if (!isNullOrUndefined(input.id_in)) {
            if (!isNullOrUndefined(input.block)) {
                const val = await TokenModel.find({ id: input.id_in, block: input.block }).exec();
                console.log(val);
                return val;
            } else {
                const val = await TokenModel.find({ id: input.id_in }).exec();
                console.log(val);
                return val;
            }
        } else {
            let limit = input.first;
            if (input.skip !== 0) {
                limit = limit + input.skip;
            }
            let val = await TokenModel.find().limit(limit).exec();
            val = val.slice(input.skip);
            console.log(val);
            return val;
        }







    }
}