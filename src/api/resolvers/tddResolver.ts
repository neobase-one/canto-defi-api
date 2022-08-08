import { Arg, Query, Resolver } from "type-graphql";
import { TokenDayData, TokenDayDataModel } from "../../models/tokenDayData";
import { TokenDayDatasInput } from "./inputs/queryInputs";

@Resolver()
export class TokenDayDatasResolver {
  @Query(returns => [TokenDayData])
  async tokenDayDatas(@Arg("input") input: TokenDayDatasInput) {
    const val = await TokenDayDataModel.find({id: input.tokenAddress}).exec();
    console.log(val);
    return val;
  }
}