import { Query, Resolver } from "type-graphql";

@Resolver((of) => String)
export class HealthResolver {
  @Query((returns) => String, { nullable: false })
  async health(): Promise<String> {
    return "hello";
  }
}
