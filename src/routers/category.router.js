import express from 'express';
import CategoryController from '../controller/category.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
import upload from '../middleware/multer.middleware.js';

const routerAPI = express.Router();
routerAPI.get('/', CategoryController.getCategory);
routerAPI.post('/',authMiddleware,upload.single("logo"), CategoryController.createCategory);
export default routerAPI;