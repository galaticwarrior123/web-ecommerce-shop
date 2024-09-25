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
            .sort(sort);
        return {
            products,
            totalPages,
        };
    } catch (error) {
        throw new Error(error.message);
    }
};

export default {
    getProductService,
};
