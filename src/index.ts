import { ApolloServer } from "apollo-server";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";
import { ChoreResolver } from "./resolvers/ChoreResolver";

async function main() {
  await createConnection();
  const schema = await buildSchema({
    resolvers: [ChoreResolver],
  });
  const server = new ApolloServer({ schema });
  await server.listen(4000, () => console.log("Server has started!"));
}

main();
