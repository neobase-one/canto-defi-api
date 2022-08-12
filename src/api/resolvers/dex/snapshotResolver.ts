import { Arg, Query, Resolver } from "type-graphql";
import { LiquidityPositionSnapshot, LiquidityPositionSnapshotModel } from "../../../models/dex/liquidityPositionSnapshot";
import { LiquidityPositionSnapshotsInput } from "../inputs/queryInputs";

@Resolver()
export class LiquidityPositionSnapshotsResolver {
    @Query(returns => [LiquidityPositionSnapshot])
    async liquidityPositionSnapshots(@Arg("input") input: LiquidityPositionSnapshotsInput) {
        let limit = input.first;
        if (input.skip !== 0) limit = limit + input.skip;
        const val = await LiquidityPositionSnapshotModel.find({ user: input.user }).limit(limit).exec();
        const result = val.slice(input.skip).map(position => { return position.toGenerated(); });
        return result;
    }
}