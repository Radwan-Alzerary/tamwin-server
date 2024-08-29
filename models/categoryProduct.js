const mongoose = require("mongoose");
const CategoryProductSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  },
  {
    timestamps: true,
  }
);
const CategoryProduct = mongoose.model(
  "CategoryProduct",
  CategoryProductSchema
);

module.exports = CategoryProduct;
