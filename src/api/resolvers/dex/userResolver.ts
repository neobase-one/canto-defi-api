import { isNullOrUndefined } from "@typegoose/typegoose/lib/internal/utils";
import { Arg, Query, Resolver } from "type-graphql";
import { User, UserModel } from "../../../models/dex/user";
import { UsersInput } from "../inputs/queryInputs";

@Resolver()
export class UsersResolver {
    @Query(returns => [User])
    async users(@Arg("input") input: UsersInput) {
        if (!isNullOrUndefined(input.block)) {
            const val = await UserModel.find({ id: input.id }).exec();
            const result = val.map(user => { return user.toGenerated(); });
            return result;
        } else {
            //Todo: fix this function
            const val = await UserModel.find({ id: input.id }).exec();
            const result = val.map(user => { return user.toGenerated(); });
            return result;
        }
    }
}



// query users {
//     user(id: "${account}", block: { number: ${ block }}) {
//     liquidityPositions
// }
//   }
