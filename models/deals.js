const mongoose = require("mongoose");
const DealsSchema = new mongoose.Schema(
  {
    mainTitle: { Type: String },
    subTitle: { Type: String },
    product: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    image: { type: String },
    discount : {type:Number}
  },
  {
    timestamps: true,
  }
);
const Deals = mongoose.model("Deals",DealsSchema);

module.exports = Deals;
