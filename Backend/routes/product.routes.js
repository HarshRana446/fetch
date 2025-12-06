import express from "express";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
} from "../controller/product.controller.js";

const route = express.Router();

route.post("/", createProduct);
route.get("/", getAllProducts);
route.put("/", updateProduct);
route.delete("/", deleteProduct);

export default route;
