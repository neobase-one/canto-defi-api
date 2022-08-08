import { Arg, Query, Resolver } from "type-graphql";
import { Bundle, BundleModel } from "../../models/bundle";
import { BundlesInput} from "./inputs/queryInputs";

@Resolver()
export class BundlesResolver {
    @Query(returns => [Bundle])
    async getBundles(@Arg("input") input: BundlesInput) {
        const val = await BundleModel.find({ id: input.id }).exec();
        console.log(val);
        return val;
    }
}