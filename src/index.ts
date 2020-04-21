import { ApolloServer } from "apollo-server-express";
import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import express from "express";
import { verify } from "jsonwebtoken";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";
import {
  createAccessToken,
  createRefreshToken,
  sendRefreshToken,
} from "./helpers";
import { User } from "./models/User";
import { ChoreResolver } from "./resolvers/ChoreResolver";
import { UserGroupResolver } from "./resolvers/UserGroupResolver";
import { UserResolver } from "./resolvers/UserResolver";

const port = process.env.PORT || 8163;

(async () => {
  await createConnection();

  const app = express();
  app.use(cookieParser()).use(cors());

  app.post("/refresh_token", async (req, res) => {
    const token = req.cookies.token;

    console.log(token);

    if (!token) {
      return res.send({ ok: false, accessToken: "" });
    }

    let payload: any = null;
    try {
      payload = verify(token, process.env.JWT_REFRESH_TOKEN_SECRET!);
    } catch (err) {
      return res.send({ ok: false, acessToken: "" });
    }

    const user = await User.findOne({ where: { id: payload.userId } });

    if (!user) {
      return res.send({ ok: false, acessToken: "" });
    }

    sendRefreshToken(res, createRefreshToken(user.id));

    return res.send({ ok: true, acessToken: createAccessToken(user.id) });
  });

  const schema = await buildSchema({
    resolvers: [ChoreResolver, UserResolver, UserGroupResolver],
  });

  const server = new ApolloServer({
    schema,
    context: ({ req, res }) => ({ req, res }),
  });

  server.applyMiddleware({ app, path: "/" });

  app.listen({ port }, () => {
    console.log(
      `🚀 Server ready at http://localhost:${port}${server.graphqlPath}`
    );
  });
})();
