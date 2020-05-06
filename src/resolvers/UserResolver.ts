import { AuthenticationError } from "apollo-server-express";
import bcrypt from "bcrypt";
import { verify } from "jsonwebtoken";
import {
  Arg,
  Ctx,
  Int,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { getConnection } from "typeorm";
import { isAuth } from "../middleware/isAuth";
import { User } from "../models/User";
import { LoginResponse } from "../responses/LoginResponse";
import { AppContext } from "../types";
import {
  createAccessToken,
  createRefreshToken,
  sendRefreshToken,
} from "../utils/auth";

@Resolver()
export class UserResolver {
  @Query(() => User, { nullable: true })
  me(@Ctx() context: AppContext) {
    const authorization = context.req.headers["authorization"];

    if (!authorization) {
      return null;
    }

    try {
      const token = authorization?.split(" ")[1];
      const payload: any = verify(token, process.env.JWT_ACCESS_TOKEN_SECRET!);
      context.payload = payload as any;
      return User.findOne(payload.userId);
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  @Query(() => User)
  user(@Arg("id") id: string) {
    return User.findOne({ where: { id }, relations: ["group", "chores"] });
  }

  @Query(() => [User])
  @UseMiddleware(isAuth)
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

    sendRefreshToken(res, createRefreshToken(userData));

    return { accessToken: createAccessToken(userData.id) };
  }

  @Mutation(() => Boolean)
  async signup(
    @Arg("username") username: string,
    @Arg("email") email: string,
    @Arg("password") password: string
  ) {
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
      console.error(err);
      return false;
    }

    return true;
  }

  @Mutation(() => Boolean)
  async logout(@Ctx() { res }: AppContext) {
    sendRefreshToken(res, "");

    return true;
  }

  //only use this for testing
  @Mutation(() => Boolean)
  async revokeRefreshToken(@Arg("userId", () => Int) userId: string) {
    await getConnection()
      .getRepository(User)
      .increment({ id: userId }, "tokenVersion", 1);

    return true;
  }
}
