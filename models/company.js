const mongoose = require("mongoose");
const CompanySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: { type: String },
    description: { type: String },
  },
  {
    timestamps: true,
  }
);
const Company = mongoose.model("Company", CompanySchema);

module.exports = Company;
