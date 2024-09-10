import mongoose from "mongoose";

const dbConnection = async () => {
    try {
        await mongoose.connect("mongodb+srv://admin:admin123456@web-ecommerce.b0gyw.mongodb.net/web-ecommerce-shop?retryWrites=true&w=majority&appName=web-ecommerce", {
            autoIndex: true,
        });
        console.log("Database connected successfully");
    } catch (e) {
        console.error(e);
    }
}


export default dbConnection;
