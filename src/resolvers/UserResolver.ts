import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { CreateUserInput } from "../inputs/CreateUserInput";
import { User } from "../models/User";

@Resolver()
export class UserResolver {
  @Query(() => User)
  async user(@Arg("id") id: string) {
    return User.findOne({ where: { id }, relations: ["group", "chores"] });
  }

  @Query(() => [User])
  users() {
    return User.find({ relations: ["group", "chores"] });
  }

  @Mutation(() => User)
  async createUser(@Arg("data") data: CreateUserInput) {
    const user = User.create(data);
    await user.save();
    return user;
  }
}
