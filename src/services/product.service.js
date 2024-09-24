//import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import ProductModel1 from "../model/products.model";

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
            query.category = filter.category;
        }

        if (filter.page) {
            skip = (filter.page - 1) * limit;
        }

        let sort = {};
        if (filter.sortByPrice === "asc") {
            sort.price = 1;
        } else if (filter.sortByPrice === "desc") {
            sort.price = -1;
        }

        const totalItems = await Product.countDocuments(query);
        const totalPages = Math.ceil(totalItems / limit);

        const products = await Product.find(query)
            .limit(limit)
            .skip(skip)
            .sort(sort);

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
        
    } catch (error) {
        throw new Error(error.message);
    }
}



const uploadImage = async (file) => {
    if (!file) return;

    const storageRef = ref(storage, `images/${file.name}`);

    try {
        // Upload the file to Firebase Storage
        const snapshot = await uploadBytes(storageRef, file);

        // Get the file's download URL
        const downloadURL = await getDownloadURL(snapshot.ref);
        console.log('Uploaded a file! Available at:', downloadURL);

        return downloadURL;
    } catch (error) {
        console.error("Upload failed:", error);
    }
};
export default {
    getProductService,
    createProductService
};
