import { ApolloServer } from "apollo-server-express";
import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import express from "express";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";
import { ChoreResolver } from "./resolvers/ChoreResolver";
import { UserGroupResolver } from "./resolvers/UserGroupResolver";
import { UserResolver } from "./resolvers/UserResolver";
import refreshToken from "./utils/refreshToken";

const port = process.env.PORT || 8163;

(async () => {
  await createConnection();

  const app = express();
  app.use("/refresh_token", cookieParser()).use(cors());

  app.post("/refresh_token", refreshToken);

  const schema = await buildSchema({
    resolvers: [ChoreResolver, UserResolver, UserGroupResolver],
    validate: false,
  });

  const server = new ApolloServer({
    schema,
    context: ({ req, res }) => ({ req, res }),
  });

  server.applyMiddleware({ app, path: "/" });

  app.listen({ port }, () => {
    console.info(
      `🚀 Server ready at http://localhost:${port}${server.graphqlPath}`
    );
  });
})();
