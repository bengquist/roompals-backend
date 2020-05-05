import { Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { User } from "../models/User";
import {
  createAccessToken,
  createRefreshToken,
  sendRefreshToken,
} from "./auth";

export default async (req: Request, res: Response) => {
  const token = req.cookies.token;
  let payload: any = null;

  if (!token) {
    return res.send({ ok: false, accessToken: "" });
  }

  try {
    payload = verify(token, process.env.JWT_REFRESH_TOKEN_SECRET!);
  } catch (err) {
    return res.send({ ok: false, accessToken: "" });
  }

  const user = await User.findOne({ where: { id: payload.userId } });

  if (!user) {
    return res.send({ ok: false, accessToken: "" });
  }

  if (user.tokenVersion !== payload.tokenVersion) {
    return res.send({ ok: false, accessToken: "" });
  }

  sendRefreshToken(res, createRefreshToken(user));

  return res.send({ ok: true, accessToken: createAccessToken(user.id) });
};
