import mongoose from "mongoose";

let isConnected: boolean = false;

export async function connectToDb() {
  mongoose.set("strictQuery", true);

  if (!process.env.MONGODB_URI) {
    console.log("Missing mongodb uri");
    return;
  }

  if (isConnected) {
    console.log("=> using existing database connection");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "DevOverflow",
    });

    console.log("=> database connection successful");
    isConnected = true;
  } catch (error) {
    console.log("=> database connection failed");
    console.log(error);
  }
}
