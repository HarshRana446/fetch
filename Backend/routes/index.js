import express from "express";
import productroutes from "./product.routes.js";

const route = express.Router();

route.use("/product", productroutes);

export default route;
