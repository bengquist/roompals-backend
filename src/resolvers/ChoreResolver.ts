import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { CreateChoreInput } from "../inputs/CreateChoreInput";
import { Chore } from "../models/Chore";

@Resolver()
export class ChoreResolver {
  @Query(() => [Chore])
  chores() {
    return Chore.find();
  }

  @Mutation(() => Chore)
  async createChore(@Arg("data") data: CreateChoreInput) {
    const chore = Chore.create(data);
    await chore.save();
    return chore;
  }
}
