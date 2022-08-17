import { Arg, Query, Resolver } from "type-graphql";
import { StableswapFactory, StableswapFactoryModel } from "../../../models/dex/stableswapFactory";
import { StableswapFactoryInput } from "../inputs/queryInputs";

@Resolver()
export class StableswapFactoryResovler {
  @Query(returns => StableswapFactory)
  async stableswapFactory(@Arg("input") input: StableswapFactoryInput) {
    const val = await StableswapFactoryModel.find({ address: input.id }).exec();
    console.log(val);
    return val[0];
  }
}