import mongoose from "mongoose";

const dbConnection = async () => {
    try {
        await mongoose.connect("mongodb+srv://admin:admin123456@web-ecommerce.b0gyw.mongodb.net/");
        console.log("Database connected successfully");
    } catch (e) {
        console.error(e);
    }
}


export default dbConnection;
