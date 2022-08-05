import mongoose from "mongoose";
import { Config } from "../config";

// Close the Mongoose default connection is the event of application termination
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  process.exit(0);
});

export const mongoDBConfig = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // useCreateIndex: true,
};

export default async (): Promise<mongoose.Mongoose> => {
  return mongoose.connect(Config.databaseUrl);
};
