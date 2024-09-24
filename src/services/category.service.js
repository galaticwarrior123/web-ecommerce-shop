import CategoryModel from "../model/category.model";

const createCategoryService = async (data) => {
    try {
        const category = new CategoryModel(data);
        await category.save();
        return { message: "Create category successfully" };
    } catch (error) {
        throw new Error(error.message);
    }
}

const getAllCategoryService = async () => {
    try {
        const categories = await CategoryModel.find();
        return categories;
    } catch (error) {
        throw new Error(error.message);
    }
}

const updateCategoryService = async (data) => {
    try {
        const { categoryId, category } = data;
        const response = await CategoryModel.findByIdAndUpdate
            (categoryId, {category});
        return response;
    }
    catch (error) {
        throw new Error(error.message);
    }
}

const deleteCategoryService = async (data) => {
    try {
        const { categoryId } = data;
        const response = await CategoryModel.findByIdAndDelete(categoryId);
        return response;
    } catch (error) {
        throw new Error(error.message);
    }
}

export default {
    createCategoryService,
    getAllCategoryService,
    updateCategoryService,
    deleteCategoryService

};