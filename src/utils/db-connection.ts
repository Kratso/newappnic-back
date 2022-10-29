import mongoose from "mongoose";
import config from "config";

const dbUrl = `mongodb://${config.get("dbString")}/${config.get("dbName")}?authSource=admin`;

const dbConnection = async () => {
  try {
    await mongoose.connect(dbUrl);
    console.log("Database connected...");
  } catch (error: any) {
    console.log(error.message);
    setTimeout(dbConnection, 5000);
  }
};

export default dbConnection;
