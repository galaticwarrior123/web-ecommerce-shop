import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connection from "./config/db/dbconnection.js";

import userRoute from "./routers/user.router.js";
import productRoute from "./routers/product.router.js";
import categoryRoute from "./routers/category.router.js";
import paymentRoute from "./routers/payment.router.js";
import orderRoute from "./routers/order.router.js";
import notificationRoute from "./routers/notification.router.js";
import shoppingCartRoute from "./routers/shoppingcart.router.js"
import reviewRoute from "./routers/review.router.js";
import promotionRoute from "./routers/promotion.router.js";
import wishlistRoute from "./routers/wishlist.router.js"
import { swaggerDocs } from "./config/swagger/swagger.js";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/user", userRoute);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/category", categoryRoute);
app.use("/api/v1/payment", paymentRoute);
app.use("/api/v1/order", orderRoute);
app.use("/api/v1/notification", notificationRoute);
app.use("/api/v1/shopping-cart", shoppingCartRoute);
app.use("/api/v1/review", reviewRoute);
app.use("/api/v1/promotion", promotionRoute);
app.use("/api/v1/wishlist", wishlistRoute);

swaggerDocs(app);

const PORT = process.env.PORT || 4000;

(async () => {
  try {
    await connection();
    app.listen(PORT, () => {
      console.log(`Example app listening on port ${PORT}`);
    });
  } catch (e) {
    console.error(e);
  }
})();
