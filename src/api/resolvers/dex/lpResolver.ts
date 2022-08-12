import { Arg, Query, Resolver } from "type-graphql";
import { LiquidityPosition, LiquidityPositionModel } from "../../../models/dex/liquidityPosition";
import { LiquidityPositionsInput} from "../inputs/queryInputs";

@Resolver()
export class LiquidityPositionsResolver {
    @Query(returns => [LiquidityPosition])
    async liquidityPositions(@Arg("input") input: LiquidityPositionsInput) {
        const val = await LiquidityPositionModel.find({ user: input.user }).exec();
        const result = val.map(position => { return position.toGenerated(); });
        return result;
    }
}