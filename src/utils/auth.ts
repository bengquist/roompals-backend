import { Response } from "express";
import { sign } from "jsonwebtoken";
import { User } from "../models/User";

const { JWT_ACCESS_TOKEN_SECRET, JWT_REFRESH_TOKEN_SECRET } = process.env;

export const createAccessToken = (userId: string) => {
  return sign({ userId }, JWT_ACCESS_TOKEN_SECRET!, { expiresIn: "15m" });
};

export const createRefreshToken = (user: User) => {
  return sign(
    { userId: user.id, tokenVersion: user.tokenVersion },
    JWT_REFRESH_TOKEN_SECRET!,
    { expiresIn: "365d" }
  );
};

export const sendRefreshToken = (res: Response, token: string) => {
  res.cookie("token", token, { httpOnly: true });
};
