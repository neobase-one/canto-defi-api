import "reflect-metadata";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema, Int } from "type-graphql";
import Decimal from "decimal.js";
import { DecimalScalar } from "./types/decimalScalar";
import { ObjectIdScalar } from "./types/objectIdScalar";
import { ObjectId } from "mongodb";
import { TypegooseMiddleware } from "./api/middlewares/typegoose";
import * as path from "path";
import { HealthResolver } from "./api/resolvers/healthResolver";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { TextEncoder, TextDecoder } from "util";
import { typeDefs } from "./schema";

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

  const mocks = {
    Int: () => Math.floor(Math.random() * 10000),
    BigDecimal: () => Decimal.random().times(new Decimal(10000)),
  }

  const server = new ApolloServer({
    typeDefs: typeDefs,
    // schema,
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
    mocks: mocks,
    mockEntireSchema: true
  });

  await server.start();
  server.applyMiddleware({ app, path: "/" });

  app.listen({ port: PORT }, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}/`);
  });

  return { server, app };
}

bootsrap();
