const mongoose = require("mongoose");
const SystemSettingSchema = new mongoose.Schema(
  {
    cashDiscount: { type: Number },
    percentageDiscount: { type: Number },
    deleveryCost: { type: Number },
    dolarPrice: { type: Number },
  },
  {
    timestamps: true,
  }
);
const SystemSetting = mongoose.model("SystemSetting", SystemSettingSchema);

module.exports = SystemSetting;
