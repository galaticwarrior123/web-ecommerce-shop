// const Discount = require("../model/discount.model");
import Order from "../model/order.model.js";
import Product from "../model/product.model.js";
import Review from "../model/review.model.js";
// const { addNotificationJob } = require("../queues/notification.queue");
// const { applyDiscountService } = require("./discount.service");
import mongoose from "mongoose";

const createOrderService = async (data) => {
  const session = await mongoose.startSession(); // Khởi tạo session
  session.startTransaction();

  try {
    const {
      userId,
      products,
      totalAmount,
      paymentMethod,
      name,
      phone,
      address,
      discountCode,
    } = data;

    // Kiểm tra và cập nhật số lượng sản phẩm
    for (const item of products) {
      const product = await Product.findById(item.productId).session(session);

      if (!product || product.quantity < item.quantity) {
        throw new Error(
          `Sản phẩm ${product.productName} không đủ số lượng để đặt hàng, số lượng sản phẩm hiện có: ${product.quantity}`
        );
      }

      product.quantity -= item.quantity;
      await product.save({ session });
    }

    // // Áp dụng mã giảm giá nếu có
    // if (discountCode) {
    //   await applyDiscountService(discountCode, userId);
    // }

    // Tạo đơn hàng trong session
    const order = await Order.create(
      [
        {
          user: userId,
          products: products.map((item) => ({
            product: item.productId,
            quantity: item.quantity,
          })),
          totalAmount,
          paymentMethod,
          discountCode,
          name,
          phone,
          address,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    return order[0];
  } catch (error) {
    await session.abortTransaction();
    throw new Error(error.message);
  } finally {
    session.endSession();
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
        path: 'products.product',
        populate: {
          path: 'category',
          model: 'Category',
          select: 'name',
        },
      });
    // .populate("discountCode");
    return orders;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getOrderByIdService = async (orderId) => {
  try {
    let order = await Order.findById(orderId)
      .populate("products.product")
      .populate("products.category");
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
    }).populate("products.product");

    // Lấy tất cả review theo sản phẩm mà user đã mua
    const reviewedProductIds = new Set(
      (await Review.find({ user: userId })).map((review) => review.product.toString())
    );

    const productSet = new Set();
    const products = [];

    for (const order of orders) {
      for (const item of order.products) {
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

const getOrderByAdminService = async (filter = {}) => {
  try {
    const limit = 10;
    let skip = 0;
    if (filter.page) {
      skip = (filter.page - 1) * limit;
    }

    const totalItems = await Order.countDocuments();
    const totalPages = Math.ceil(totalItems / limit);

    let orders = await Order.find()
      .populate("products.product")
      .populate("products.product.category", "name")
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 });

    return {
      orders,
      totalPages,
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