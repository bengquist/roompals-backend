import { AuthenticationError } from "apollo-server-express";
import { verify } from "jsonwebtoken";
import { MiddlewareFn } from "type-graphql";
import { AppContext } from "../types";

export const isAuth: MiddlewareFn<AppContext> = ({ context }, next) => {
  const authorization = context.req.headers["authorization"];

  if (!authorization) {
    throw new AuthenticationError("Not authenticated");
  }

  try {
    const token = authorization?.split(" ")[1];
    const payload = verify(token, process.env.JWT_ACCESS_TOKEN_SECRET!);
    context.payload = payload as any;
  } catch (err) {
    throw new AuthenticationError("Not authenticated");
  }

  return next();
};
