import express from 'express';
import CategoryController from '../controller/category.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
import upload from '../middleware/multer.middleware.js';

const routerAPI = express.Router();
routerAPI.get('/', CategoryController.getCategory);
routerAPI.post('/',authMiddleware,upload.single("logo"), CategoryController.createCategory);
routerAPI.put('/:id',authMiddleware,upload.single("logo"), CategoryController.updateCategory);
routerAPI.delete('/:id',authMiddleware, CategoryController.deleteCategory);
export default routerAPI;