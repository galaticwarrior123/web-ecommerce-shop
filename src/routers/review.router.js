import express from "express";
const {
  postCreateReview,
  getReviewByProduct,
} = require("../controller/review.controller");
const { auth } = require("../middleware/auth");
const { createReviewValidator } = require("../validator/review.validator");

const routerAPI = express.Router();

routerAPI.get("/product/:productId", getReviewByProduct);
routerAPI.post("/", auth, createReviewValidator, postCreateReview);

export default routerAPI;