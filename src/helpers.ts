import { sign } from "jsonwebtoken";

const {
  JWT_ACCESS_TOKEN_SECRET = "supersecretone",
  JWT_REFRESH_TOKEN_SECRET = "supersecrettwo",
} = process.env;

export const createAccessToken = (userId: string) => {
  return sign({ userId }, JWT_ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
};

export const createRefreshToken = (userId: string) => {
  return sign({ userId }, JWT_REFRESH_TOKEN_SECRET, { expiresIn: "365d" });
};
