const mongoose = require("mongoose");
const InvoiceSchema = new mongoose.Schema(
  {
    product: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        size: { type: String },
        color: { type: String },
        price: { type: Number },
        count: { type: Number },
      },
    ],
    invoicePrice:{type:Number},
    invoiceCost: { type: Number },
    InvoiceDiscount: { type: Number },
    description: { type: String },
    type: { type: String },
  },
  {
    timestamps: true,
  }
);
const Invoice = mongoose.model("Invoice", InvoiceSchema);

module.exports = Invoice;
