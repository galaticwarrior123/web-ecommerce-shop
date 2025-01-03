import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  // products: [
  //   {
  //     product: {
  //       type: mongoose.Schema.Types.ObjectId,
  //       ref: "Product",
  //       required: true,
  //     },
  //     quantity: { type: Number, required: true },
  //   },
  // ],
  shoppingCart : {type: mongoose.Schema.Types.ObjectId, ref: "ShoppingCart", required: true},
  totalAmount: { type: Number, required: true },
  status: {
    type: String,
    enum: ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"],
    default: "PENDING",
  },
  paymentMethod: {
    type: String,
    enum: ["COD", "ONLINE"],
    default: "COD",
  },
  name: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date},
});

const Order = mongoose.model("Order", orderSchema);

export default Order;
