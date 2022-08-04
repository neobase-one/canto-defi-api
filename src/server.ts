import "reflect-metadata";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import Decimal from "decimal.js";
import { DecimalScalar } from "./types/decimalScalar";
import { ObjectIdScalar } from "./types/objectIdScalar";
import { ObjectId } from "mongodb";
import { TypegooseMiddleware } from "./api/middlewares/typegoose";
import * as path from "path";
import { HealthResolver } from "./api/resolvers/healthResolver";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";

const PORT = process.env.PORT || 4001;

async function bootsrap() {
  const app = express();

  const schema = await buildSchema({
    resolvers: [HealthResolver], // todo: add resolvers
    emitSchemaFile: path.resolve(__dirname, "generated-schema.gql"),
    // use document converting middleware
    globalMiddlewares: [TypegooseMiddleware],
    // use ObjectId scalar mapping
    scalarsMap: [
      { type: ObjectId, scalar: ObjectIdScalar },
      { type: Decimal, scalar: DecimalScalar },
    ],
    validate: false,
  });

  const server = new ApolloServer({
    schema,
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
  });

  await server.start();
  server.applyMiddleware({ app, path: "/" });

  app.listen({ port: PORT }, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}/`);
  });

  return { server, app };
}

bootsrap();
