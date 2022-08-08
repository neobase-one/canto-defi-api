import { Arg, Query, Resolver } from "type-graphql";
import { TokenDayData } from "../../models/tokenDayData";
import { TokenDayDatasInput } from "./inputs/queryInputs";

@Resolver()
export class TokenDayDatasResolver {
  @Query(returns => [TokenDayData])
  async tokenDayDatas(@Arg("input") input: TokenDayDatasInput) {
    
    // insert service function here
    // return TokenDayDatasResponse
    
    
    // const val = await TokenDayDataModel.find({address: input.tokenAddr}).exec();
    // console.log(val);
    // return val;
  }
}