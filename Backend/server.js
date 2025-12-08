import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import  connectDB  from "./db/db.js";
import routes from "./routes/index.js";

dotenv.config();
connectDB();
const app = express();
const PORT = process.env.PORT;
app.use(cors());
app.use(express.json());
app.use("/v1", routes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});