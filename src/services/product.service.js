import { getDownloadURL, ref as storageRef, uploadBytes } from "firebase/storage";
import { database, storage } from "../config/firebase.js";
import { ref as databaseRef, child, push, update } from "firebase/database";
import ProductModel from "../model/product.model.js";
import PromotionModel from "../model/promotion.model.js";
import Review from "../model/review.model.js";
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

        const filterProducts = products.filter(product => !product.isDeleted);
        return {
            filterProducts,
            totalPages,
        };
    } catch (error) {
        throw new Error(error.message);
    }
};

const getAllProducts = async () => {
    try {
        const products = await ProductModel.find(); // Lấy tất cả sản phẩm
        const promotions = await PromotionModel.find(); // Lấy tất cả khuyến mãi
        const reviews = await Review.find(); // Lấy tất cả đánh giá
        
        const currentDate = new Date(); // Ngày hiện tại

        // Mức độ ưu tiên cho các badge
        const badgePriority = {
            'Phải thử': 3, // Ưu tiên cao nhất
            'sale': 2,     // Ưu tiên trung bình
            'new': 1       // Ưu tiên thấp nhất
        };

        // Lọc sản phẩm đủ điều kiện cho badge "Must Try"
        const mustTryProducts = await Promise.all(products
            .filter(product => !product.isDeleted && product.sold_count > 0) // Chưa bị xóa và có lượt mua
            .map((product) => {
                const productReviews = reviews.filter(review => review.product.toString() === product._id.toString());
                
                if (productReviews.length > 0) {
                    // Tính điểm trung bình của sản phẩm
                    const averageRating = productReviews.reduce((sum, review) => sum + review.rating, 0) / productReviews.length;

                    // Nếu điểm trung bình lớn hơn 3, thì sản phẩm đủ điều kiện "Must Try"
                    if (averageRating > 3) {
                        return product;
                    }
                }
            })
            .filter(Boolean) // Lọc ra các sản phẩm không null
            .slice(0, 5) // Lấy 5 sản phẩm đầu tiên
        );

        const filterProducts = products
            .filter(product => !product.isDeleted) // Lọc sản phẩm chưa bị xóa
            .map(product => {
                const productPromotion = promotions.find(promo => promo.product.toString() === product._id.toString());

                // Khởi tạo badge ban đầu
                let badge = '';
                let badgeRank = 0; // Mức độ ưu tiên của badge

                // Kiểm tra khuyến mãi
                if (productPromotion) {
                    const startDate = new Date(productPromotion.startDate);
                    const endDate = new Date(productPromotion.endDate);

                    if (currentDate >= startDate && currentDate <= endDate) {
                        // Sản phẩm đang trong thời gian khuyến mãi
                        badge = 'sale';
                        product.badge = 'sale';
                        product.badgeRank = 2;
                        badgeRank = Math.max(badgeRank, badgePriority['sale']); // Cập nhật mức độ ưu tiên
                        product.sale_price = productPromotion.discount
                            ? product.origin_price * (1 - productPromotion.discount / 100)
                            : product.sale_price; // Tính giá khuyến mãi
                    } else {
                        // Nếu khuyến mãi chưa bắt đầu hoặc đã hết hạn
                        product.sale_price = 0; // Reset giá khuyến mãi
                    }
                }

                // Kiểm tra sản phẩm mới
                const createdDate = new Date(product.createdAt);
                const daysSinceCreation = (currentDate - createdDate) / (1000 * 60 * 60 * 24);

                if (daysSinceCreation <= 15 && badge !== 'sale') {
                    badge = 'new'; // Chỉ gán 'new' nếu không có 'sale'
                    badgeRank = Math.max(badgeRank, badgePriority['new']); // Cập nhật mức độ ưu tiên
                }

                // Kiểm tra và gán badge "Must Try"
                if (mustTryProducts.some(mustTry => mustTry._id.toString() === product._id.toString())) {
                    badge = 'Phải thử';
                    badgeRank = Math.max(badgeRank, badgePriority['Phải thử']); // Cập nhật mức độ ưu tiên
                }

                // Cập nhật badge và mức độ ưu tiên
                product.badge = badge;
                product.badgeRank = badgeRank;

                return product;
            });

        // Sắp xếp các sản phẩm theo mức độ ưu tiên của badge
        filterProducts.sort((a, b) => b.badgeRank - a.badgeRank);

        // Lưu lại badge vào database
        filterProducts.forEach(async product => {
            await ProductModel.updateOne({ _id: product._id }, { badge: product.badge });
        });

        return { success: true, data: filterProducts };
    } catch (error) {
        throw new Error('Lỗi server: ' + error.message);
    }
};






const getTop10BestSellingProducts = async () => {
    try {
        const products = await ProductModel.find({ isDeleted: false }) // Lọc sản phẩm chưa bị xóa
            .sort({ sold_count: -1 }) // Sắp xếp theo lượt bán giảm dần
            .limit(10); // Giới hạn 10 sản phẩm

        const promotions = await PromotionModel.find(); // Lấy tất cả khuyến mãi
        const reviews = await Review.find(); // Lấy tất cả đánh giá
        const currentDate = new Date(); // Ngày hiện tại

        const mustTryProducts = products
            .filter(product => product.sold_count > 0) // Sản phẩm có lượt bán > 0
            .slice(0, 5); // Lấy 5 sản phẩm có lượt bán cao nhất

        const updatedProducts = products.map(product => {
            const productPromotion = promotions.find(promo => promo.product.toString() === product._id.toString());
            let badge = '';
            let badgeRank = 0; // Mức độ ưu tiên của badge

            // Kiểm tra khuyến mãi
            if (productPromotion) {
                const startDate = new Date(productPromotion.startDate);
                const endDate = new Date(productPromotion.endDate);

                if (currentDate >= startDate && currentDate <= endDate) {
                    // Sản phẩm đang trong thời gian khuyến mãi
                    badge = 'sale';
                    badgeRank = Math.max(badgeRank, 2); // Ưu tiên 'sale'
                    product.sale_price = productPromotion.discount
                        ? product.origin_price * (1 - productPromotion.discount / 100)
                        : product.sale_price;
                } else {
                    product.sale_price = 0; // Reset giá khuyến mãi
                }
            }

            // Kiểm tra sản phẩm mới
            const createdDate = new Date(product.createdAt);
            const daysSinceCreation = (currentDate - createdDate) / (1000 * 60 * 60 * 24);

            if (daysSinceCreation <= 15 && badge !== 'sale') {
                badge = 'new'; // Chỉ gán 'new' nếu không có 'sale'
                badgeRank = Math.max(badgeRank, 1); // Ưu tiên 'new'
            }

            // Kiểm tra và gán badge "Must Try"
            if (mustTryProducts.some(mustTry => mustTry._id.toString() === product._id.toString())) {
                badge = 'Phải thử';
                badgeRank = Math.max(badgeRank, 3); // Ưu tiên 'Phải thử' cao nhất
            }

            product.badge = badge;
            product.badgeRank = badgeRank; // Lưu mức độ ưu tiên

            return product;
        });

        // Sắp xếp các sản phẩm theo mức độ ưu tiên của badge
        updatedProducts.sort((a, b) => b.badgeRank - a.badgeRank);

        // lưu lại badge vào database
        updatedProducts.forEach(async product => {
            await ProductModel.updateOne({ _id: product._id }, { badge: product.badge });
        });

        return { success: true, data: updatedProducts };
    } catch (error) {
        throw new Error('Lỗi server: ' + error.message);
    }
};


const getTop10BestViewProducts = async () => {
    try {
        const products = await ProductModel.find({ isDeleted: false }) // Lọc sản phẩm chưa bị xóa
            .sort({ view_count: -1 }) // Sắp xếp theo lượt xem giảm dần
            .limit(10); // Giới hạn 10 sản phẩm

        const promotions = await PromotionModel.find(); // Lấy tất cả khuyến mãi
        const currentDate = new Date(); // Ngày hiện tại

        // Lọc top 5 sản phẩm có lượt bán > 0 và có lượt xem cao nhất
        const mustTryProducts = products
            .filter(product => product.sold_count > 0) // Sản phẩm có lượt bán > 0
            .slice(0, 5); // Lấy 5 sản phẩm có lượt xem cao nhất

        const updatedProducts = products.map(product => {
            const productPromotion = promotions.find(promo => promo.product.toString() === product._id.toString());
            let badge = '';
            let badgeRank = 0; // Mức độ ưu tiên của badge

            // Kiểm tra khuyến mãi
            if (productPromotion) {
                const startDate = new Date(productPromotion.startDate);
                const endDate = new Date(productPromotion.endDate);

                if (currentDate >= startDate && currentDate <= endDate) {
                    // Sản phẩm đang trong thời gian khuyến mãi
                    badge = 'sale';
                    badgeRank = Math.max(badgeRank, 2); // Ưu tiên 'sale'
                    product.sale_price = productPromotion.discount
                        ? product.origin_price * (1 - productPromotion.discount / 100)
                        : product.sale_price;
                } else {
                    product.sale_price = 0; // Reset giá khuyến mãi
                }
            }

            // Kiểm tra sản phẩm mới
            const createdDate = new Date(product.createdAt);
            const daysSinceCreation = (currentDate - createdDate) / (1000 * 60 * 60 * 24);

            if (daysSinceCreation <= 15 && badge !== 'sale') {
                badge = 'new'; // Chỉ gán 'new' nếu không có 'sale'
                badgeRank = Math.max(badgeRank, 1); // Ưu tiên 'new'
            }

            // Kiểm tra và gán badge "Must Try"
            if (mustTryProducts.some(mustTry => mustTry._id.toString() === product._id.toString())) {
                badge = 'Phải thử';
                badgeRank = Math.max(badgeRank, 3); // Ưu tiên 'Phải thử' cao nhất
            }

            product.badge = badge;

            return product;
        });

        // Sắp xếp các sản phẩm theo mức độ ưu tiên của badge
        updatedProducts.sort((a, b) => b.badgeRank - a.badgeRank);

        // lưu lại badge vào database
        updatedProducts.forEach(async product => {
            await ProductModel.updateOne({ _id: product._id }, { badge: product.badge });
        });

        return { success: true, data: updatedProducts };
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
        updatedProduct.origin_price = product.origin_price;
        updatedProduct.description = product.description;
        updatedProduct.category = product.category;
        updatedProduct.quantity = product.quantity;
        updatedProduct.sold_count = product.sold_count;
        updatedProduct.view_count = product.view_count;
        updatedProduct.badge = product.badge;
        updatedProduct.origin = product.origin;
        updatedProduct.supplier = product.supplier;
        updatedProduct.expired = product.expired;
        await updatedProduct.save();
        return updatedProduct;
    }
    catch (error) {
        throw new Error('Lỗi khi cập nhật sản phẩm');
    }
};

const findProductsWithoutPromotion = async () => {
    try {
        const products = await ProductModel.find({ isDeleted: false });
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

const removeProductService = async (id) => {
    try {
        await PromotionModel.findOneAndDelete({ product: id }); // Xóa khuyến mãi liên quan
        await ProductModel.updateOne({ _id: id }, { $set: { isDeleted: true } }); // Đánh dấu sản phẩm đã bị xóa



        return { success: true, message: 'Xóa sản phẩm thành công' };
    }
    catch (error) {
        throw new Error('Lỗi khi xóa sản phẩm');
    }

}

const getSimilarProducts = async (productId) => {
    try {
        const product = await ProductModel.findById(productId);
        const products = await ProductModel.find({ category: product.category, _id: { $ne: productId } }).where('isDeleted').equals(false);
        return { success: true, data: products };
    } catch (error) {
        throw new Error('Lỗi server: ' + error.message);
    }
}
const increaseViewCount = async (productId) => {
    try {
        const product = await ProductModel.findById(productId);
        product.view_count++;
        await product.updateOne({ view_count: product.view_count });
        return { success: true, data: product };
    }
    catch (error) {
        throw new Error('Lỗi server: ' + error.message);
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
    removeProductService,
    updateProductService,
    findProductsWithoutPromotion,
    getSimilarProducts,
    increaseViewCount
};
