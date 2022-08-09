import { isNullOrUndefined } from "@typegoose/typegoose/lib/internal/utils";
import { Arg, Query, Resolver } from "type-graphql";
import { TokenDayData, TokenDayDataModel } from "../../models/tokenDayData";
import { TokenDayDatasInput } from "./inputs/queryInputs";

@Resolver()
export class TokenDayDatasResolver {
  @Query(returns => [TokenDayData])
  async tokenDayDatas(@Arg("input") input: TokenDayDatasInput) {
    if (!isNullOrUndefined(input.date_gt)) {
      const val = await TokenDayDataModel.find({ date: { $gte: input.date_gt } }).exec();
      console.log(val);
      console.log("in single param search");
      return val;
    } else {
      const val = await TokenDayDataModel.find({ id: input.tokenAddress }).exec();
      console.log(val);
      console.log("in double param search");
      return val;
    }
  }
}