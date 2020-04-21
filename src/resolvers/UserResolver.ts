import { AuthenticationError } from "apollo-server-express";
import bcrypt from "bcrypt";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { createAccessToken, createRefreshToken } from "../helpers";
import { CreateUserInput } from "../inputs/CreateUserInput";
import { User } from "../models/User";
import { LoginResponse } from "../responses/LoginResponse";
import { AppContext } from "../types";

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

  @Mutation(() => LoginResponse)
  async login(
    @Arg("user") user: string,
    @Arg("password") password: string,
    @Ctx() { req, res }: AppContext
  ): Promise<LoginResponse> {
    const userData = await User.findOne({
      where: [{ username: user }, { email: user }],
    });

    if (!userData) {
      throw new AuthenticationError(
        "Could not find a user with that username or email"
      );
    }

    const isValidPassword = await bcrypt.compare(password, userData.password);

    if (!isValidPassword) {
      throw new AuthenticationError("Incorrect password");
    }

    const refreshToken = createRefreshToken(userData.id);
    const accessToken = createAccessToken(userData.id);

    res.cookie("token", refreshToken, { httpOnly: true });

    return { accessToken };
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
