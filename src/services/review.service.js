import Review from "../model/review.model.js";

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

export default { getReviewByProductService, createReviewService };