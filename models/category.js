const mongoose = require("mongoose");
const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: { type: String },
    description: { type: String },
    productCount : {type:Number,default:0},
    active: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);
const Category = mongoose.model("Category", CategorySchema);

module.exports = Category;
