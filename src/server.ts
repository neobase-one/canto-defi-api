import express from "express";
import mongoose from "mongoose";

import loaders from "./loaders";
import { Config } from "./config";
import { indexHistoricalEvents, initSubscribers } from "./subscribers";

async function bootsrap() {
  const app = express();

  const server = await loaders(app);

  await server.start();
  
  server.applyMiddleware({
    app,
    path: Config.api.prefix,
    // Health check on /.well-known/apollo/server-health
    onHealthCheck: async () => {
      if (mongoose.connection.readyState === 1) return;

      throw new Error();
    },
  });

  app.listen({ port: Config.port }, () =>
    console.log(
      `🚀 Server ready at http://localhost:${Config.port}${Config.api.prefix}`
    )
  );
  
  // HISTORICAL EVENTS
  indexHistoricalEvents(Config.canto.latestBlockNumber);


  // SUBSCRIPTIONS
  initSubscribers();
};

bootsrap();
