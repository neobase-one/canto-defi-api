import express from "express";
import { ApolloServer } from "apollo-server-express";

// loaders
import apolloLoader from "./apollo";
import expressLoader from "./express";
import mongooseLoader from "./mongoose";
import { Config } from "../config";
import { initFactoryCollection } from "../services/eventHandlers/baseV1Factory";

export default async (app: express.Application): Promise<ApolloServer> => {
  // Load everything related to express
  await expressLoader(app);
  console.log("CUSTOM: Express config completed");

  // Connect to mongoose
  await mongooseLoader();
  // todo: init objects + collections
  await initFactoryCollection();
  console.log("CUSTOM: Mongoose connection completed");

  // load apollo server config
  return apolloLoader();
};
