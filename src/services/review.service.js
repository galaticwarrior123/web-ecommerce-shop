import Review from "../models/review.model";

const getReviewByProductService = async (productId) => {
  try {
    let rs = await Review.find({ product: productId }).populate("user");
    return rs;
  } catch (error) {
    throw new Error(error.message);
  }
};

const createReviewService = async (review) => {
  try {
    let rs = await Review.create(review);
    return rs;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = { createReviewService, getReviewByProductService };
