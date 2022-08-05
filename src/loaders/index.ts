import express from "express";
import { ApolloServer } from "apollo-server-express";

// loaders
import apolloLoader from "./apollo";
import expressLoader from "./express";
import mongooseLoader from "./mongoose";
import { Config } from "../config";

export default async (app: express.Application): Promise<ApolloServer> => {
  // Load everything related to express
  await expressLoader(app);
  console.log("CUSTOM: Express config completed");

  // Connect to mongoose
  await mongooseLoader();
  console.log("CUSTOM: Mongoose connection completed");

  // load apollo server config
  return apolloLoader();
};
