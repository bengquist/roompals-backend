import { Query, Resolver } from "type-graphql";

@Resolver()
export class ChoreResolver {
  @Query(() => String)
  hello() {
    return "world";
  }
}
