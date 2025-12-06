import mongoose from "mongoose";

export const productSchema = new mongoose.Schema({
  dummyId: {
    type: Number,
  },
  thumbnail: {
    type: String,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

const Product = mongoose.model("Product", productSchema);

export default Product;
