import { isNullOrUndefined } from "@typegoose/typegoose/lib/internal/utils";
import { Arg, Query, Resolver } from "type-graphql";
import { TokenDayData, TokenDayDataModel } from "../../../models/dex/tokenDayData";
import { OrderDirection, TokenDayDatasInput } from "../inputs/queryInputs";

@Resolver()
export class TokenDayDatasResolver {
  @Query(returns => [TokenDayData])
  async tokenDayDatas(@Arg("input") input: TokenDayDatasInput) {
    if (!isNullOrUndefined(input.date)) {
      let limit = input.first;
      if (input.skip !== 0) {
        limit = limit + input.skip;
      }
      let sortBy = input.orderBy;
      if (input.orderDirection === OrderDirection.DES) {
        sortBy = "-" + sortBy.trim;
      }
      let val = await TokenDayDataModel.find({ date: { $gte: input.date } }).sort(sortBy).limit(limit).exec();
      val = val.slice(input.skip);
      console.log(val);
      console.log("in single param search");
      return val;
    } else {
      let limit = input.first;
      if (input.skip !== 0) {
        limit = limit + input.skip;
      }
      let sortBy = input.orderBy;
      if (input.orderDirection === OrderDirection.DES) {
        sortBy = "-" + sortBy.trim;
      }
      let val = await TokenDayDataModel.find({ token: input.tokenAddress }).sort(sortBy).limit(limit).exec();
      val = val.slice(input.skip);
      console.log(val);
      console.log("in double param search");
      return val;
    }
  }
}