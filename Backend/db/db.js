import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const { connection } = await mongoose.connect(process.env.MONGO_URI);
    console.log(`mongodb connected with ${connection.name} database`);
  } catch (error) {
    console.log("Connection Failed", error);
    process.exit(1);
  }
};
export default connectDB;
