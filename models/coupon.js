const mongoose = require("mongoose");
const CompanySchema = new mongoose.Schema(
  {
    percentageCoupon: { type: Number },
    cashCoupon: { type: Number },
    coupontype: { type: String },
    startDate: { type: Date },
    expireDate: { type: Date },
    active: { type: Boolean, default: True },
  },
  {
    timestamps: true,
  }
);
const Company = mongoose.model("Company", CompanySchema);

module.exports = Company;
