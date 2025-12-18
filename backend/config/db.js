import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(
      'mongodb+srv://simranjeetkour8407_db_user:simran1908@food-app.ypmg9ix.mongodb.net/',
      { dbName: "food-app" }
    );
    console.log("DB connected to food-app");
  } catch (error) {
    console.log("DB connection error:", error);
  }
};