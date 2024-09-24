import categoryController from "../controller/category.controller";



const routerAPI = express.Router();
routerAPI.get("/", categoryController.getAllCategory);
routerAPI.post("/", categoryController.createCategory);
routerAPI.put("/{categoryId}", categoryController.updateCategory);
routerAPI.delete("/{categoryId}", categoryController.deleteCategory);