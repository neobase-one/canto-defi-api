import { Arg, Query, Resolver } from "type-graphql";
import { TokenDayDatasInput } from "./inputs/queryInputs";
import { TokenDayDatasResponse } from "./responseTypes";

@Resolver()
export class TokenDayDatasResolver {
  @Query(returns => TokenDayDatasResponse)
  async tokenDayDatas(@Arg("input") input: TokenDayDatasInput) {
    
    // insert service function here
    // return TokenDayDatasResponse
    
    
    // const val = await TokenDayDataModel.find({address: input.tokenAddr}).exec();
    // console.log(val);
    // return val;
  }
}