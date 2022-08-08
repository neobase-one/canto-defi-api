import { Field, ObjectType } from "type-graphql";
import { TokenDayData } from "../../models/tokenDayData"

@ObjectType()
export class TokenDayDatasResponse {
    @Field(()=>[TokenDayData])
    tokenDayDatas: TokenDayData[];
}