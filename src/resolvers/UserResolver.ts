import { AuthenticationError } from "apollo-server-express";
import bcrypt from "bcrypt";
import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { CreateUserInput } from "../inputs/CreateUserInput";
import { User } from "../models/User";

@Resolver()
export class UserResolver {
  @Query(() => User)
  user(@Arg("id") id: string) {
    return User.findOne({ where: { id }, relations: ["group", "chores"] });
  }

  @Query(() => [User])
  users() {
    return User.find({ relations: ["group", "chores"] });
  }

  @Mutation(() => User)
  async login(@Arg("user") user: string, @Arg("password") password: string) {
    const userData = await User.findOne({
      where: [{ username: user }, { email: user }],
    });

    if (!userData) {
      throw new AuthenticationError("No user with that username or email");
    }

    const isCorrectPassword = await bcrypt.compare(password, userData.password);

    if (!isCorrectPassword) {
      throw new AuthenticationError("Incorrect password");
    }

    return userData;
  }

  @Mutation(() => Boolean)
  async signup(@Arg("data") { username, email, password }: CreateUserInput) {
    const userWithUsername = await User.findOne({ username });
    const userWithEmail = await User.findOne({ email });

    if (userWithUsername) {
      throw new AuthenticationError("Username is already taken");
    }
    if (userWithEmail) {
      throw new AuthenticationError("Email is already taken");
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    try {
      User.insert({
        username,
        email,
        password: hashedPassword,
      });
    } catch (err) {
      console.log(err);
      return false;
    }

    return true;
  }
}
