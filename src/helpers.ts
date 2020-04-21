import jwt from "jsonwebtoken";

const {
  JWT_ACCESS_TOKEN_SECRET = "",
  JWT_REFRESH_TOKEN_SECRET = "",
} = process.env;

export const createTokens = (res: any, userId: string) => {
  const refreshToken = jwt.sign({ userId }, JWT_REFRESH_TOKEN_SECRET || "", {
    expiresIn: "7d",
  });
  const accessToken = jwt.sign({ userId }, JWT_ACCESS_TOKEN_SECRET || "", {
    expiresIn: "15m",
  });

  res.cookie("refresh-token", refreshToken, {
    expiresIn: 60 * 60 * 24 * 7,
  });
  res.cookie("access-token", accessToken, { expiresIn: 60 * 60 * 15 });
};
