import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { ApolloServer } from "apollo-server-express";
import Decimal from "decimal.js";
import { ObjectId } from "mongodb";
import { buildSchema } from "type-graphql";
import { TypegooseMiddleware } from "../api/middlewares/typegoose";
import { resolvers } from "../api/resolvers";
import { typeDefs } from "../schema";
import { DecimalScalar } from "../types/decimalScalar";
import { ObjectIdScalar } from "../types/objectIdScalar";

export default async () => {
  const schema = await buildSchema({
    resolvers: resolvers,
    emitSchemaFile: true,
    // emitSchemaFile: path.resolve(__dirname, "generated-schema.gql"),
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
  };

  const server = new ApolloServer({
    typeDefs: typeDefs,
    schema,
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
    // mocks: mocks,
    // mockEntireSchema: true,
  });

  return server;
};
