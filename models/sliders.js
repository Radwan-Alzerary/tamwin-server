const mongoose = require("mongoose");
const CompanyProductSchema = new mongoose.Schema(
  {
    name: { type: String },
    product: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  },
  {
    timestamps: true,
  }
);
const CompanyProduct = mongoose.model("CompanyProduct", CompanyProductSchema);

module.exports = CompanyProduct;
