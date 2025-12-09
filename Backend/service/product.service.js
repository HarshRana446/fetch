import Product from "../model/product.model.js";

export const createProductService = async (data) => {
  try {
    const product = await Product.create(data);
    return { status: 201, product };
  } catch (error) {
    return { status: 500, error: error.message };
  }
};

export const updateProductService = async (body) => {
  try {
    const { _id, ...update } = body;
    const updatedProduct = await Product.findByIdAndUpdate(_id, update, {
      new: true,
    });
    if (!updatedProduct) {
      throw new Error("Product not found");
    }
    return updatedProduct;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const deleteProductService = async ({ _id }) => {
  try {
    if (!_id) {
      throw new Error("Product ID is Missing");
    }
    const deleteProduct = await Product.findByIdAndDelete({ _id });
    return deleteProduct;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getAllProductsService = async ({ q, limit = 10, skip = 0 }) => {
  try {
    const filter = q ? { title: new RegExp(q, "i") } : {};

    const products = await Product.find(filter)
      .skip(Number(skip))
      .limit(Number(limit));

    const total = await Product.countDocuments(filter);
    return { status: 200, products, total, q, limit, skip };
  } catch (error) {
    throw new Error(error.message);
  }
};

export default {
  createProductService,
  updateProductService,
  deleteProductService,
  getAllProductsService,
};
