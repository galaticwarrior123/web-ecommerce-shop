import reviewService from "../services/review.service.js";

const getReviewByProduct = async (req, res) => {
  const productId = req.params.productId;
  try {
    const rs = await reviewService.getReviewByProductService(productId);
    res.status(200).json({
      DT: rs,
      EM: "Get review by product successfully",
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const postCreateReview = async (req, res) => {
  try {
    const review = req.body;
    review.user = req.userId;
    const rs = await reviewService.createReviewService(review);
    res.status(200).json({
      DT: rs,
      EM: "Create review successfully",
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export default { getReviewByProduct, postCreateReview };
