import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { CreateUserGroupInput } from "../inputs/CreateUserGroupInput";
import { UserGroup } from "../models/UserGroup";

@Resolver()
export class UserGroupResolver {
  @Query(() => [UserGroup])
  groups() {
    return UserGroup.find();
  }

  @Mutation(() => UserGroup)
  async createUserGroup(@Arg("data") data: CreateUserGroupInput) {
    const group = UserGroup.create(data);
    await group.save();
    return group;
  }
}
