import mongoose from "mongoose";
import "dotenv/config";

export default function connectDB() {
  const url = process.env.DB_STRING;

  try {
    mongoose.connect(url);
  } catch (err) {
    console.error(err.message);
  }

  const dbConnection = mongoose.connection;

  dbConnection.once("open", () => {
    console.log("Database connected.");
  });

  dbConnection.on("error", (err) => {
    console.error(`Dabatase connection error ${err}`);
  });
}

// mongoose.set("strictQuery", false);
