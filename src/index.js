import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connection from "./config/db/dbconnection.js";
import userRoute from "./routers/user.router.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/user", userRoute);

const PORT = process.env.PORT || 3000;

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
