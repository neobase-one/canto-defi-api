import { Arg, Query, Resolver } from "type-graphql";
import { TokenDayData } from "../../models/tokenDayData";
import { UniswapDayDatasInput } from "./inputs/queryInputs";

@Resolver()
export class UniswapDayDatasResolver {
  @Query(returns => [TokenDayData])
  async tokenDayDatas(@Arg("input") input: UniswapDayDatasInput) {
    
    // insert service function here
    // return TokenDayDatasResponse
    
    
    // const val = await TokenDayDataModel.find({address: input.tokenAddr}).exec();
    // console.log(val);
    // return val;
  }
}