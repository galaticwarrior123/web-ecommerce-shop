import productService from "../services/product.service.js";

const getProduct = async (req, res) => {
    try {
        const { name, category, sort, page } = req.query;
        let rs = await productService.getProductService({
            name,
            category,
            sort,
            page,
        });
        return res.status(200).json({
            DT: rs,
            EM: "Get product successfully",
        });
    } catch (error) {
        return res.status(400).json({
            DT: null,
            EM: error.message,
        });
    }
}

const getAllProducts = async (req, res) => {
    try {
        const allProducts = await productService.getAllProducts();
        res.json({ DT: { products: allProducts.data } });
    } catch (error) {
        console.error("Lỗi khi lấy tất cả sản phẩm:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const getTop10BestSellingProducts = async (req, res) => {
    try {
        // Chỉ lấy danh sách sản phẩm bán chạy nhất
        const topSellingProducts = await productService.getTop10BestSellingProducts();

        // Gói kết quả vào đối tượng DT
        res.json({ DT: { products: topSellingProducts.data } });
    } catch (error) {
        console.error("Lỗi khi lấy sản phẩm bán chạy nhất:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const getTop10BestViewProducts = async (req, res) => {
    try {
        // Chỉ lấy danh sách sản phẩm bán chạy nhất
        const topViewingProducts = await productService.getTop10BestViewProducts();

        // Gói kết quả vào đối tượng DT
        res.json({ DT: { products: topViewingProducts.data } });
    } catch (error) {
        console.error("Lỗi khi lấy sản phẩm xem nhiều nhất:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};
const createProduct = async (req, res) => {
    try {
        const product = req.body;
        const newProduct = await productService.createProductService(product, req, res);
        return res.status(200).json({
            DT: newProduct,
            EM: "Create product successfully",
        });
    } catch (error) {
        return res.status(400).json({
            DT: null,
            EM: error.message,
        });
    }
}
const updateProduct = async (req, res) => {
    try {
        const product = req.body;
        const { id } = req.params;
        const newProduct = await productService.updateProductService(id, product, req, res);
        return res.status(200).json({
            DT: newProduct,
            EM: "Update product successfully",
        });
    } catch (error) {
        return res.status(400).json({
            DT: null,
            EM: error.message,
        });
    }
}
const getProductById = async (req, res) => {
    const { id } = req.params; // Lấy ID từ request params

    try {
        const product = await productService.findProductById(id);

        if (!product) {
            return res.status(404).json({ message: 'Sản phẩm không tìm thấy' });
        }
        return res.status(200).json(product);
    } catch (error) {
        console.error('Lỗi khi lấy sản phẩm:', error);
        return res.status(500).json({ message: 'Lỗi server' });
    }
};

const getSimilarProducts = async (req, res) => {
    const { id } = req.params; // Lấy ID từ request params

    try {
        const products = await productService.getSimilarProducts(id);

        if (!products) {
            return res.status(404).json({ message: 'Sản phẩm không tìm thấy' });
        }
        return res.status(200).json(products);
    } catch (error) {
        console.error('Lỗi khi lấy sản phẩm tương tự:', error);
        return res.status(500).json({ message: 'Lỗi server' });
    }
};

const findProductsWithoutPromotion = async (req, res) => {
    try {
        const products = await productService.findProductsWithoutPromotion();
        return res.status(200).json({
            DT: products,
            EM: "Get products successfully",
        });
    } catch (error) {
        return res.status(400).json({
            DT: null,
            EM: error.message,
        });
    }
}
const deleteProduct = async (req, res) => {
    const { id } = req.params; // Lấy ID từ request params

    try {
        const product = await productService.deleteProductService(id);

        if (!product) {
            return res.status(404).json({ message: 'Sản phẩm không tìm thấy' });
        }
        return res.status(200).json({ message: 'Xóa sản phẩm thành công' });
    } catch (error) {
        console.error('Lỗi khi xóa sản phẩm:', error);
        return res.status(500).json({ message: 'Lỗi server' });
    }
};

const increaseViewCount = async (req, res) => {
    const { productId } = req.params;

    try {
        const result = await productService.increaseViewCount(productId);
        return res.status(200).json(result);
    } catch (error) {
        console.error('Lỗi khi tăng lượt xem sản phẩm:', error);
        return res.status(500).json({ message: 'Lỗi server' });
    }
};

export default {
    getProduct,
    getTop10BestSellingProducts,
    getTop10BestViewProducts,
    getAllProducts,
    createProduct,
    getProductById,
    deleteProduct,
    updateProduct,
    findProductsWithoutPromotion,
    getSimilarProducts,
    increaseViewCount
};