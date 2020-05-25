import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { CreateUserGroupInput } from "../inputs/CreateUserGroupInput";
import { Chore } from "../models/Chore";
import { User } from "../models/User";
import { UserGroup } from "../models/UserGroup";

@Resolver()
export class UserGroupResolver {
  @Query(() => UserGroup)
  group(@Arg("id") id: string) {
    return UserGroup.findOne({
      where: { id },
      relations: ["admin"],
    });
  }

  @Query(() => [UserGroup])
  groups() {
    return UserGroup.find();
  }

  @Mutation(() => UserGroup)
  async createUserGroup(
    @Arg("data") { adminId, ...data }: CreateUserGroupInput
  ) {
    const group = await UserGroup.create(data);
    const admin = await User.findOne({ where: { id: adminId } });
    const chores = await Chore.find();

    if (admin) group.admin = admin;
    group.chores = chores;
    group.users = admin ? [admin] : [];
    group.code = Math.random().toString(36).substring(7);

    await group.save();
    return group;
  }

  @Mutation(() => UserGroup)
  async joinUserGroup(
    @Arg("userId") userId: string,
    @Arg("groupId") groupId: string
  ) {
    const user = await User.findOne(userId);
    const group = await UserGroup.findOne(groupId);

    if (!group) {
      throw new Error("No group found with that name");
    }

    if (user?.group) user.group = group;
  }
}
