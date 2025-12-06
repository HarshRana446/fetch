import ProductService from "../service/index.js";

export const createProduct = async (req, res) => {
  try {
    const product = await ProductService.createProductService(req.body);
    res.status(201).json({ message: "Product created successfully", product });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Product creation failed", error: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await ProductService.updateProductService(req.body);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product updated successfully", product });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Product update failed", error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await ProductService.deleteProductService(req.body);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted successfully", product });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Product deletion failed", error: error.message });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const { q, limit, skip } = req.query;
    const { products, total } = await ProductService.getAllProductsService({
      q,
      limit,
      skip,
    });
    res.status(200).json({
      message: "Products fetched successfully",
      products,
      total,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch products from dummyjson",
      error: error.message,
    });
  }
};
