const mongoose = require("mongoose");
const CompanyProductSchema = new mongoose.Schema(
  {
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  },
  {
    timestamps: true,
  }
);
const CompanyProduct = mongoose.model("CompanyProduct", CompanyProductSchema);

module.exports = CompanyProduct;
