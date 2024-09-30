import express from 'express';
import CategoryController from '../controller/category.controller.js';

const routerAPI = express.Router();
routerAPI.get('/', CategoryController.getCategory);

export default routerAPI;