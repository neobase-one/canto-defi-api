import { Arg, Query, Resolver } from "type-graphql";
import { Token, TokenModel } from "../../models/token";
import { TokenInput } from "./inputs/queryInputs";

@Resolver()
export class TokensResolver {
    @Query(returns => [Token])
    async tokens(@Arg("input") input: TokenInput) {
        const val = await TokenModel.find({ id: input.id }).exec();
        console.log(val);
        return val;
    }
}