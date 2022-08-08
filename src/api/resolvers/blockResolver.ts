import { Arg, Query, Resolver } from "type-graphql";
import { Block } from "../../models/block";
import { BlocksInput } from "./inputs/queryInputs";

@Resolver()
export class BlockResolver {
  @Query(returns => [Block])
  async tokenDayDatas(@Arg("input") input: BlocksInput) {

    // insert service function here
    // return TokenDayDatasResponse


    // const val = await TokenDayDataModel.find({address: input.tokenAddr}).exec();
    // console.log(val);
    // return val;
  }
}