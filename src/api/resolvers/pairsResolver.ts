import { Arg, Query, Resolver } from "type-graphql";
import { Pair, PairModel } from "../../models/pair";
import { PairInput} from "./inputs/queryInputs";

@Resolver()
export class PairsResolver {
    @Query(returns => [Pair])
    async getPairs(@Arg("input") input: PairInput) {
        const val = await PairModel.find({ id: input.id }).exec();
        console.log(val);
        return val;
    }
}