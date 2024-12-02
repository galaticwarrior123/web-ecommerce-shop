// const Discount = require("../model/discount.model");
import Order from "../model/order.model.js";
import Product from "../model/product.model.js";
import Review from "../model/review.model.js";
// const { addNotificationJob } = require("../queues/notification.queue");
// const { applyDiscountService } = require("./discount.service");
import mongoose, { Types } from "mongoose";
import ShoppingCart from "../model/shoppingcart.model.js";
import ProductModel from "../model/product.model.js";
import NotificationModel from "../model/notification.model.js";
import User from "../model/user.model.js";
const createOrderService = async (data) => {
  const session = await mongoose.startSession(); // Khởi tạo session
  session.startTransaction(); // Bắt đầu transaction

  try {
    const {
      userId,
      shoppingCart,
      totalAmount,
      paymentMethod,
      name,
      phone,
      address,
      selectedProducts,
    } = data;

    // Lấy thông tin giỏ hàng
    const cartItems = await ShoppingCart.findById(shoppingCart)
      .populate({ path: "products.product" })
      .session(session);

    if (!cartItems) {
      throw new Error("Shopping cart not found");
    }

    const removedProducts = [];

    // Cập nhật giỏ hàng theo `selectedProducts`
    cartItems.products = cartItems.products.filter((item) => {
      const selectedProduct = selectedProducts.find(
        (p) => p.product === item.product._id.toString()
      );
      if (selectedProduct) {
        item.quantity = selectedProduct.quantity; // Cập nhật số lượng
        return true; // Giữ lại sản phẩm
      } else {
        removedProducts.push(item); // Thêm vào danh sách sản phẩm bị loại
        return false; // Loại khỏi giỏ hàng
      }
    });

    await cartItems.save({ session }); // Lưu giỏ hàng với session

    // Tạo đơn hàng mới
    const order = new Order({
      user: userId,
      shoppingCart: shoppingCart,
      totalAmount,
      paymentMethod,
      name,
      phone,
      address,
    });
    await order.save({ session }); // Lưu đơn hàng với session

    // Tạo giỏ hàng mới từ các sản phẩm bị loại
    const newCart = new ShoppingCart({
      user: userId,
      products: removedProducts,
      totalAmount: 0,
      isActive: true,
      isPaid: false,
    });
    await newCart.save({ session }); // Lưu giỏ hàng mới với session


    // Cập nhật số lượng sản phẩm trong kho
    for (const item of cartItems.products) {
      const product = await ProductModel.findById(item.product._id).session(session);
      if (!product) {
        throw new Error("Product not found");
      }

      if (product.quantity < item.quantity) {
        throw new Error("Not enough product in stock");
      }

      // Cập nhật số lượng sản phẩm
      await ProductModel.updateOne({ _id: item.product._id }, { $inc: { quantity: -item.quantity, sold_count: +item.quantity } }).session(session);
    }

    // Đánh dấu giỏ hàng hiện tại là đã thanh toán và không còn hoạt động
    cartItems.isActive = false;
    cartItems.isPaid = true;
    await cartItems.save({ session });



    await session.commitTransaction(); // Xác nhận transaction
    session.endSession(); // Kết thúc session

    return { success: true, order, newCart };
  } catch (error) {
    await session.abortTransaction(); // Hủy transaction nếu có lỗi
    session.endSession(); // Kết thúc session
    throw new Error(error.message);
  }
};





const cancelOrderService = async (orderId, userId) => {
  try {
    let order = await Order.findOne({ _id: orderId, user: userId });
    if (!order) {
      throw new Error("Order not found");
    }
    if (order.status === "CANCELLED") {
      throw new Error("Order already cancelled");
    }
    if (order.status !== "PENDING") {
      throw new Error("You can only cancel orders that are pending");
    }
    for (const item of order.products) {
      const product = await Product.findById(item.product);

      if (product) {
        product.quantity += item.quantity;
        await product.save();
      }
    }
    order.status = "CANCELLED";
    if (order.discountCode) {
      const discount = await Discount.findById(order.discountCode);
      if (discount) {
        discount.usersUsed = discount.usersUsed.filter(
          (user) => user.toString() !== userId
        );
        await discount.save();
      }
    }
    await order.save();
    return order;
  } catch (error) {
    throw new Error(error.message);
  }
};

const changeOrderStatusService = async (orderId, status) => {
  try {
    let order = await Order.findById(orderId);
    if (!order) {
      throw new Error("Order not found");
    }
    order.status = status;
    if (status === "DELIVERED") {
      order.updatedAt = Date.now();
    }
    await order.save();
    // addNotificationJob({
    //   userId: order.user,
    //   orderId: order._id,
    //   newStatus: status,
    // });
    return order;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getOrderByUserService = async (userId) => {
  try {
    let orders = await Order.find({ user: userId })
      .populate({
        path: "shoppingCart",
        populate: {
          path: "products.product",
          populate: {
            path: "category"
          }
        }
      })
      .populate("user");
    return orders;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getOrderByIdService = async (orderId) => {
  try {
    let order = await Order.findById(orderId)
      .populate({
        path: "shoppingCart",
        populate: {
          path: "products.product",
          populate: {
            path: "category"
          }
        }
      })
      .populate("user");
    return order;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getProductUserPurchasedService = async (userId) => {
  try {
    let orders = await Order.find({
      user: userId,
      status: "DELIVERED",
    }).populate({
      path: "shoppingCart",
      populate: {
        path: "products.product",
        match: { isDeleted: false },
        populate: {
          path: "category"
        }
      }
    });


    // Lấy tất cả review theo sản phẩm mà user đã mua
    const reviewedProductIds = new Set(
      (await Review.find({ user: userId })).map((review) => review.product.toString())
    );

    const productSet = new Set();
    const products = [];

    for (const order of orders) {
      for (const item of order.shoppingCart.products) {
        const productId = item.product._id.toString();
        // Chỉ thêm sản phẩm nếu nó chưa có trong danh sách review
        if (!reviewedProductIds.has(productId) && !productSet.has(productId)) {
          productSet.add(productId);
          products.push(item.product);
        }
      }
    }

    return products;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getOrderByAdminService = async () => {
  try {
    const orders = await Order.find()
      .populate({
        path: "shoppingCart",
        populate: {
          path: "products.product",
          match: { isDeleted: false },
          populate: {
            path: "category"
          }
        }
      })
      .populate("user")
      .sort({ createdAt: -1 });

    return {
      orders,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

export default {
  createOrderService,
  cancelOrderService,
  changeOrderStatusService,
  getOrderByUserService,
  getOrderByIdService,
  getProductUserPurchasedService,
  getOrderByAdminService,
};