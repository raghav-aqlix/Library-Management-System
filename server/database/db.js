import mongoose from "mongoose";

export const connectDB = () => {
  mongoose
    .connect(process.env.MONGO_URI, {
      dbName: "MERN_Stack_LMS",
    })
    .then(() => {
      console.log("DB Connected successfully");
    })
    .catch(() => {
      console.log("Error connecting to DB");
    });
};
