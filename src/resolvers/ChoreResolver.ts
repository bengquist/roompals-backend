import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { CreateChoreInput } from "../inputs/CreateChoreInput";
import { Chore } from "../models/Chore";
import { User } from "../models/User";

@Resolver()
export class ChoreResolver {
  @Query(() => [Chore])
  chores() {
    return Chore.find();
  }

  @Mutation(() => Chore)
  async createChore(@Arg("data") data: CreateChoreInput) {
    const chore = Chore.create(data);
    const users = await User.find();
    chore.user = users[0];
    await chore.save();
    return chore;
  }
}
