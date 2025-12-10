import dotenv from "dotenv";
dotenv.config();
import axios from "axios";
import Product from "../model/index.js";
import connectDB from "../db/db.js";

const seedProducts = async () => {
  try {
    await connectDB();

    const { data } = await axios.get(
      "https://dummyjson.com/products?limit=200"
    );

    const items = data.products.map((p) => ({
      title: p.title,
      description: p.description,
      price: p.price,
      thumbnail: p.thumbnail,
    }));

    await Product.insertMany(items);

    console.log("DummyJSON products imported successfully!");
    process.exit();
  } catch (err) {
    console.error("Seeding failed:", err.message);
    process.exit(1);
  }
};

seedProducts();

export default seedProducts;
