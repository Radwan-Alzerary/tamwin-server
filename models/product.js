const mongoose = require("mongoose");
const ProductSchema = new mongoose.Schema(
  {
    name: { Type: String },
    price: { type: Number },
    description: { type: String },
    active: { type: Boolean, default: false },
    company :{type: mongoose.Schema.Types.ObjectId, ref: "Company"},
    category :{type: mongoose.Schema.Types.ObjectId, ref: "Category"},
    viewImage: { type: String },
    coverImage: [{ type: String }],
    mainPackage: [{ type: mongoose.Schema.Types.ObjectId, ref: "Package" }],
    categories: [
      {
        id: { type: mongoose.Schema.Types.ObjectId, ref: "Package" },
        price: { type: Number },
        default: { type: Boolean, defult: false },
      },
    ],
    images: [{ type: String }],
    backgroundImages: [{ type: String }],
    cost: { type: Number },
    discountDisplay: { type: Number },
  },
  {
    timestamps: true,
  }
);
const Product = mongoose.model("Product", ProductSchema);

module.exports = Product;
