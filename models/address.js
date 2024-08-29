const mongoose = require("mongoose");
const addressSchema = new mongoose.Schema(
  {
    phoneNumber1: { type: String },
    phoneNumber2: { type: String },
    countery: { type: String, default: "IQ" },
    governorate: { type: String },
    city: { type: String },
    Region: { type: String },
    nearestPlace: { type: String },
    lat: { type: String },
    lon: { type: String },
  },
  {
    timestamps: true,
  }
);
const address = mongoose.model("address", addressSchema);

module.exports = address;
