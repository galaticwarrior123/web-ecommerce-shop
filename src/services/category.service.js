import { getDownloadURL, ref as storageRef, uploadBytes } from "firebase/storage";
import { database, storage} from "../config/firebase.js";
import { ref as databaseRef } from "firebase/database";
import CategoryModel from '../model/category.model.js';
import { child, getDatabase, push } from "firebase/database";

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

        // Tải ảnh lên Storage
        await uploadBytes(storageReference, file);
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

export default { 
    getCategoryService, 
    createCategoryService 
};