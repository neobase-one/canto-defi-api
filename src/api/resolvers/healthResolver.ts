import { Query, Resolver } from "type-graphql";

@Resolver()
export class HealthResolver {
  @Query((returns) => String, { nullable: false })
  async health(): Promise<String> {
    return "hello";
  }
}
