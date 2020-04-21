import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { CreateChoreInput } from "../inputs/CreateChoreInput";
import { Chore } from "../models/Chore";
import { User } from "../models/User";
import { UserGroup } from "../models/UserGroup";

@Resolver()
export class ChoreResolver {
  @Query(() => [Chore])
  chore(@Arg("id") id: string) {
    return Chore.findOne({ where: { id }, relations: ["user", "group"] });
  }

  @Query(() => [Chore])
  chores() {
    return Chore.find({ relations: ["user", "group"] });
  }

  @Mutation(() => Chore)
  async createChore(@Arg("data") data: CreateChoreInput) {
    const chore = Chore.create(data);
    const user = await User.findOne({ where: { id: data.ownerId } });
    const group = await UserGroup.findOne({ where: { id: data.groupId } });

    if (user) chore.user = user;
    if (group) chore.group = group;

    await chore.save();
    return chore;
  }
}
