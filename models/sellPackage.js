const mongoose = require("mongoose");
const PackageSchema = new mongoose.Schema(
  {
    name: { type: String },
    nestedNum: { type: Number },
    isNested: { tpye: Boolean },
    fillings: { type: Number },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Package",
    },
    childrenPackage: [{ type: mongoose.Schema.Types.ObjectId, ref: "Package" }],
    active: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);
const Package = mongoose.model("Package", PackageSchema);

module.exports = Package;
