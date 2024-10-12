import Product from '../model/product.model.js';

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

        const totalItems = await Product.countDocuments(query);
        const totalPages = Math.ceil(totalItems / limit);
        const products = await Product.find(query)
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
        const products = await Product.find(); // Lấy tất cả sản phẩm
        return { success: true, data: products };
    } catch (error) {
        throw new Error('Lỗi server: ' + error.message);
    }
};

const getTop10BestSellingProducts = async () => {
    try {
        const products = await Product.find()
            .sort({ sold_count: -1 }) // Sắp xếp theo lượt bán giảm dần
            .limit(10); // Giới hạn 10 sản phẩm
        return { success: true, data: products };
    } catch (error) {
        throw new Error('Lỗi server: ' + error.message);
    }
};

const getTop10BestViewProducts = async () => {
    try {
        const products = await Product.find()
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



export default {
    getProductService,
    getTop10BestSellingProducts,
    getTop10BestViewProducts,
    updateProductBadges,
    getAllProducts
};
