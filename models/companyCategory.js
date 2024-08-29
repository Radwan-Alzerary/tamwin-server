const mongoose = require("mongoose");
const companyCategorySchema = new mongoose.Schema(
  {
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  },
  {
    timestamps: true,
  }
);
const companyCategory = mongoose.model("companyCategory", companyCategorySchema);

module.exports = companyCategory;
