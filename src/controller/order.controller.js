import orderService from "../services/order.service.js";

const postCreateOrder = async (req, res) => {
  try {
    const {
      products,
      totalAmount,
      paymentMethod,
      name,
      phone,
      address,
      discountCode,
    } = req.body;
    const userId = req.user.userId;
    let data = {
      userId,
      products,
      totalAmount,
      paymentMethod,
      name,
      phone,
      address,
      discountCode,
    };
    let rs = await orderService.createOrderService(data);
    return res.status(200).json({
      DT: rs,
      EM: "Create order successfully",
    });
  } catch (error) {
    return res.status(400).json({
      DT: null,
      EM: error.message,
    });
  }
};

const putCancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.userId;
    let rs = await orderService.cancelOrderService(orderId, userId);
    return res.status(200).json({
      DT: rs,
      EM: "Cancel order successfully",
    });
  } catch (error) {
    return res.status(400).json({
      DT: null,
      EM: error.message,
    });
  }
};

const putChangeOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    let rs = await orderService.changeOrderStatusService(orderId, status);
    return res.status(200).json({
      DT: rs,
      EM: "Change order status successfully",
    });
  } catch (error) {
    return res.status(400).json({
      DT: null,
      EM: error.message,
    });
  }
};

const getOrderByUser = async (req, res) => {
  try {
    const userId = req.userId;
    let rs = await orderService.getOrderByUserService(userId);
    return res.status(200).json({
      DT: rs,
      EM: "Get order by user successfully",
    });
  } catch (error) {
    return res.status(400).json({
      DT: null,
      EM: error.message,
    });
  }
};

const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    let rs = await orderService.getOrderByIdService(orderId);
    return res.status(200).json({
      DT: rs,
      EM: "Get order by id successfully",
    });
  } catch (error) {
    return res.status(400).json({
      DT: null,
      EM: error.message,
    });
  }
};

const getProductUserPurchased = async (req, res) => {
  try {
    const userId = req.userId;
    let rs = await orderService.getProductUserPurchasedService(userId);
    return res.status(200).json({
      DT: rs,
      EM: "Get product user purchased successfully",
    });
  } catch (error) {
    return res.status(400).json({
      DT: null,
      EM: error.message,
    });
  }
};

const getOrderByAdmin = async (req, res) => {
  try {
    const { page } = req.query;
    let rs = await orderService.getOrderByAdminService({ page });
    return res.status(200).json({
      DT: rs,
      EM: "Get order by admin successfully",
    });
  } catch (error) {
    return res.status(400).json({
      DT: null,
      EM: error.message,
    });
  }
};

export default {
  postCreateOrder,
  putCancelOrder,
  putChangeOrderStatus,
  getOrderByUser,
  getOrderById,
  getProductUserPurchased,
  getOrderByAdmin,
};
