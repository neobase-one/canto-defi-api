import { isNullOrUndefined } from "@typegoose/typegoose/lib/internal/utils";
import { Arg, Query, Resolver } from "type-graphql";
import { TokenDayData, TokenDayDataModel } from "../../models/tokenDayData";
import { OrderDirection, TokenDayDatasInput } from "./inputs/queryInputs";

@Resolver()
export class TokenDayDatasResolver {
  @Query(returns => [TokenDayData])
  async tokenDayDatas(@Arg("input") input: TokenDayDatasInput) {
    if (!isNullOrUndefined(input.date)) {
      const val = await TokenDayDataModel.find({ date: { $gte: input.date } }).exec();
      console.log(val);
      console.log("in single param search");
      return val;
    } else {
      let sortBy = input.orderBy;
      if (input.orderDirection === OrderDirection.DES) {
        sortBy = "-" + sortBy.trim;
      }
      const val = await TokenDayDataModel.find({ id: input.tokenAddress }).sort(sortBy).exec();
      console.log(val);
      console.log("in double param search");
      return val;
    }
  }
}