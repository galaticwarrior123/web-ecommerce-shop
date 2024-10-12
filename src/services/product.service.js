import ProductModel from "../model/product.model.js";

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

const createProductService = async (product) => {
    try {
        const newProduct = new ProductModel(product);
        const listImage = [];
        for (let i = 0; i < product.images.length; i++) {
            const image = await uploadImage(product.images[i]);
            listImage.push(image);
        }

        newProduct.images = listImage;
        await newProduct.save();
        return { message: "Create product successfully" };
    } catch (error) {
        throw new Error(error.message);
    }
}



async function uploadImage(file) {
    try {
        // Tạo một reference cho ảnh trong Firebase Storage
        const storageRef = ref(storage, 'images/' + file.name);
        console.log('Uploading file:', file.name);
        // Tải ảnh lên Storage
        await uploadBytes(storageRef, file);
        console.log('File uploaded successfully!');

        // Lấy URL của ảnh sau khi tải lên
        const downloadURL = await getDownloadURL(storageRef);
        console.log('Download URL:', downloadURL);

        // Lưu URL của ảnh vào Firebase Realtime Database
        const imageId = Date.now(); // Tạo một ID duy nhất cho ảnh
        await set(dbRef(database, 'images/' + imageId), {
            url: downloadURL,
            name: file.name,
            uploadedAt: new Date().toISOString()
        });

        console.log('Image URL saved to Realtime Database');
    } catch (error) {
        console.error('Error uploading file:', error);
    }
}

export default {
    getProductService,
    createProductService
};
