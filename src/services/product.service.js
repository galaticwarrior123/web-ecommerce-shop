import { getDownloadURL, ref as storageRef, uploadBytes } from "firebase/storage";
import { database, storage } from "../config/firebase.js";
import { ref as databaseRef, child, push, update } from "firebase/database";
import ProductModel from "../model/product.model.js";
import PromotionModel from "../model/promotion.model.js";
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

const getAllProducts = async () => {
    try {
        const products = await ProductModel.find(); // Lấy tất cả sản phẩm
        return { success: true, data: products };
    } catch (error) {
        throw new Error('Lỗi server: ' + error.message);
    }
};

const getTop10BestSellingProducts = async () => {
    try {
        const products = await ProductModel.find()
            .sort({ sold_count: -1 }) // Sắp xếp theo lượt bán giảm dần
            .limit(10); // Giới hạn 10 sản phẩm
        return { success: true, data: products };
    } catch (error) {
        throw new Error('Lỗi server: ' + error.message);
    }
};

const getTop10BestViewProducts = async () => {
    try {
        const products = await ProductModel.find()
            .sort({ view_count: -1 }) // Sắp xếp theo lượt xem giảm dần
            .limit(10); // Giới hạn 10 sản phẩm
        return { success: true, data: products };
    } catch (error) {
        throw new Error('Lỗi server: ' + error.message);
    }
};

// Hàm cập nhật badge cho sản phẩm
const updateProductBadges = (allProducts, topSellingProducts, topViewedProducts) => {
    const sellingIds = new Set(topSellingProducts.map(product => product._id.toString()));
    const viewedIds = new Set(topViewedProducts.map(product => product._id.toString()));

    return allProducts.map(product => {
        const isTopSelling = sellingIds.has(product._id.toString());
        const isTopViewed = viewedIds.has(product._id.toString());

        if (isTopSelling && isTopViewed) {
            product.badge = 'Must Try';
        } else if (isTopSelling) {
            product.badge = 'Best';
        } else if (isTopViewed) {
            product.badge = 'Hot';
        } else {
            product.badge = ''; // Hoặc giá trị mặc định
        }

        return product;
    });
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

const updateProductService = async (id, product, req, res) => {
    try {
        const updatedProduct = await ProductModel.findById(id);
        if (!updatedProduct) {
            throw new Error('Không tìm thấy sản phẩm');
        }
        
        if (req.files) {
            for (let i = 0; i < req.files.length; i++) {
                const image = await uploadImage(req.files[i]); // Upload ảnh
                updatedProduct.images.push(image); // Thêm URL ảnh vào sản phẩm
            }
        }
        updatedProduct.productName = product.productName;
        updatedProduct.price = product.price;
        updatedProduct.description = product.description;
        updatedProduct.category = product.category;
        updatedProduct.quantity = product.quantity;
        updatedProduct.sold_count = product.sold_count;
        updatedProduct.view_count = product.view_count;
        updatedProduct.badge = product.badge;
        await updatedProduct.save();
        return updatedProduct;
    }
    catch (error) {
        throw new Error('Lỗi khi cập nhật sản phẩm');
    }
};

const findProductsWithoutPromotion = async () => {
    try {
        const products = await ProductModel.find();
        const promotionProducts = await PromotionModel.find();
        const productIds = promotionProducts.map(promotionProduct => promotionProduct.product.toString());
        const productsWithoutPromotion = products.filter(product => !productIds.includes(product._id.toString()));
        return { success: true, data: productsWithoutPromotion };
       
    } catch (error) {
        throw new Error('Lỗi server: ' + error.message);
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

const findProductById = async (id) => {
    try {
        const product = await ProductModel.findById(id).populate('category', 'name');
        return { success: true, DT: product };
    } catch (error) {
        throw new Error('Lỗi khi tìm sản phẩm');
    }
};

const deleteProductService = async (id) => {
    try {
        await PromotionModel.findOneAndDelete({ product: id }); // Xóa khuyến mãi liên quan
        await ProductModel.findByIdAndDelete(id);
        
        return { success: true, message: 'Xóa sản phẩm thành công' };
    }
    catch (error) {
        throw new Error('Lỗi khi xóa sản phẩm');
    }
}

export default {
    getProductService,
    getTop10BestSellingProducts,
    getTop10BestViewProducts,
    updateProductBadges,
    getAllProducts,
    createProductService,
    findProductById,
    deleteProductService,
    updateProductService,
    findProductsWithoutPromotion
};
