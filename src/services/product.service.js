import { getDownloadURL, ref as storageRef, uploadBytes } from "firebase/storage";
import { database, storage } from "../config/firebase.js";
import { ref as databaseRef, child, push } from "firebase/database";
import ProductModel from "../model/product.model.js";

// Hàm lấy sản phẩm với bộ lọc
const getProductService = async (filter = {}) => {
    try {
        const limit = 10; // Số lượng sản phẩm mỗi trang
        let skip = 0; // Số sản phẩm cần bỏ qua để phân trang
        const query = {};

        if (filter.name) {
            const searchQuery = filter.name.trim();
            query.productName = { $regex: searchQuery, $options: "i" };
        }

        if (filter.category) {
            query.category = { $in: filter.category.split(",") };
        }

        if (filter.page) {
            skip = (filter.page - 1) * limit;
        }

        let sort = {};
        if (filter.sort === "asc") {
            sort.price = 1;
        } else if (filter.sort === "desc") {
            sort.price = -1;
        }

        const totalItems = await ProductModel.countDocuments(query);
        const totalPages = Math.ceil(totalItems / limit);
        const products = await ProductModel.find(query)
            .limit(limit)
            .skip(skip)
            .sort(sort)
            .populate("category", "name");
        return {
            products,
            totalPages,
        };
    } catch (error) {
        throw new Error(error.message);
    }
};

// Hàm tạo sản phẩm mới và upload ảnh
const createProductService = async (product, req, res) => {
    try {
        const newProduct = new ProductModel(product);
        if (req.files) {
            for (let i = 0; i < req.files.length; i++) {
                const image = await uploadImage(req.files[i]); // Upload ảnh
                newProduct.images.push(image); // Thêm URL ảnh vào sản phẩm
            }
        }
        await newProduct.save();
        return newProduct;
    } catch (error) {
        throw new Error(error.message);
    }
};

// Hàm upload ảnh lên Firebase Storage và lưu URL vào Firebase Realtime Database
async function uploadImage(file) {
    try {
        // Tạo một reference cho ảnh trong Firebase Storage
        const storageReference = storageRef(storage, `images/${file.originalname}`);
        console.log('Uploading file:', file.originalname);

        const metadata = {
            contentType: file.mimetype
        };

        // Tải ảnh lên Firebase Storage (truyền `file.buffer` thay vì `file`)
        await uploadBytes(storageReference, file.buffer, metadata);
        console.log('File uploaded successfully!');

        // Lấy URL của ảnh sau khi upload thành công
        const downloadURL = await getDownloadURL(storageReference);
        console.log('Download URL:', downloadURL);

        // Lưu URL của ảnh vào Firebase Realtime Database
        const imageDatabaseRef = child(databaseRef(database), 'images');
        await push(imageDatabaseRef, { url: downloadURL }); // Lưu URL dưới dạng object

        console.log('Image URL saved to Realtime Database');
        return downloadURL; // Trả về URL của ảnh
    } catch (error) {
        console.error('Error uploading file:', error);
        throw new Error('Failed to upload image');
    }
}

export default {
    getProductService,
    createProductService
};
