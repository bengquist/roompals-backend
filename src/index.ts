import { ApolloServer } from "apollo-server-express";
import cors from "cors";
import "dotenv/config";
import express from "express";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";
import { ChoreResolver } from "./resolvers/ChoreResolver";
import { UserGroupResolver } from "./resolvers/UserGroupResolver";
import { UserResolver } from "./resolvers/UserResolver";

const port = process.env.PORT || 8163;

(async () => {
  await createConnection();

  const schema = await buildSchema({
    resolvers: [ChoreResolver, UserResolver, UserGroupResolver],
  });

  const server = new ApolloServer({
    schema,
    context: ({ req, res }) => ({ req, res }),
  });

  const app = express();

  app.use(cors());

  server.applyMiddleware({ app, path: "/" });

  app.listen({ port }, () => {
    console.log(
      `🚀 Server ready at http://localhost:${port}${server.graphqlPath}`
    );
  });
})();
