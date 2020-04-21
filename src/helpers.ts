import { sign } from "jsonwebtoken";

const { JWT_ACCESS_TOKEN_SECRET, JWT_REFRESH_TOKEN_SECRET } = process.env;

export const createAccessToken = (userId: string) => {
  return sign({ userId }, JWT_ACCESS_TOKEN_SECRET!, { expiresIn: "15m" });
};

export const createRefreshToken = (userId: string) => {
  return sign({ userId }, JWT_REFRESH_TOKEN_SECRET!, { expiresIn: "365d" });
};
