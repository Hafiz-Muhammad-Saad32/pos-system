// Connects to MongoDB via Mongoose
import mongoose from "mongoose";

async function connectDB(uri: string) {
  mongoose.set("strictQuery", true);
  await mongoose.connect(uri);
  console.log(`[db] connected -> ${mongoose.connection.name}`);
  return mongoose.connection;
}

export { connectDB };
