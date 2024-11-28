import { getDownloadURL, ref as storageRef, uploadBytes } from "firebase/storage";
import { database, storage } from "../config/firebase.js";
import { ref as databaseRef } from "firebase/database";
import CategoryModel from '../model/category.model.js';
import { child, getDatabase, push } from "firebase/database";
import ProductModel from "../model/product.model.js";

const getCategoryService = async () => {
    try {
        const categories = await CategoryModel.find();
        return categories;
    } catch (error) {
        throw error;
    }
};

const createCategoryService = async (category, req, res) => {
    try {
        const newCategory = new CategoryModel(category);
        if (req.file) {
            const image = await uploadImage(req.file);
            newCategory.logo = image;
        }
        await newCategory.save();
        return newCategory;
    } catch (error) {
        throw error;
    }
};



async function uploadImage(file) {
    try {
        // Tạo một reference cho ảnh trong Firebase Storage
        const storageReference = storageRef(storage, `images/${file.originalname}`);
        console.log('Uploading file:', file.originalname);


        const metadata = {
            contentType: file.mimetype
        };

        // Tải ảnh lên Storage
        await uploadBytes(storageReference, file.buffer, metadata);
        console.log('File uploaded successfully!');

        // Lấy URL của ảnh sau khi tải lên
        const downloadURL = await getDownloadURL(storageReference);
        console.log('Download URL:', downloadURL);

        // Lưu URL vào Realtime Database
        const imageDatabaseRef = child(databaseRef(database), 'images');
        await push(imageDatabaseRef, downloadURL);


        console.log('Image URL saved to Realtime Database');
        return downloadURL;
    } catch (error) {
        console.error('Error uploading file:', error);
    }
}

async function updateCategoryService(id, category, req, res) {
    try {
        const updatedCategory = await CategoryModel.findById(id);
        if (!updatedCategory) {
            throw new Error('Không tìm thấy danh mục');
        }

        if (req.file) {
            const image = await uploadImage(req.file);
            console.log('image: ', image);
            updatedCategory.logo = image;
        }
        updatedCategory.name = category.name;
        await updatedCategory.save();
        return updatedCategory;
    }

    catch (error) {
        throw new Error('Lỗi khi cập nhật danh mục');
    }

}

async function deleteCategoryService(id) {
    try {
        // xóa hết sản phẩm trong danh mục đó 
        // xóa danh mục

        // nếu có sản phẩm trong danh mục thì không thể xóa

        const listProduct = await ProductModel.find({ category: id }).exec();
        if (listProduct.length > 0) {
            // for (const product of listProduct) {
            //     await ProductModel.findByIdAndDelete(product._id);
            // }
            return { message: 'Không thể xóa danh mục này vì có sản phẩm trong danh mục', success: false };
        }
        else {
            const category = await CategoryModel.findByIdAndDelete(id);
            if (!category) {
                throw new Error('Không tìm thấy danh mục');
            }
            return { message: 'Xóa danh mục thành công', success: true };
        }
    } catch (error) {
        throw error;
    }
}

export default {
    getCategoryService,
    createCategoryService,
    updateCategoryService,
    deleteCategoryService
};