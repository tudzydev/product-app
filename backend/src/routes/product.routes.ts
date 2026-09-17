import { Router } from "express";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  getStats,
  seedProductsController,
} from "../controllers/product.controller";
import {
  validateProductId,
  validateCreateProduct,
  validateUpdateProduct,
} from "../middleware/validator";

const router = Router();

// Special collection routes (MUST be defined before /:id)
router.get("/stats", getStats);
router.get("/categories", getCategories);
router.post("/seed", seedProductsController);

// Standard CRUD routes
router.get("/", getAllProducts);
router.get("/:id", validateProductId, getProductById);
router.post("/", validateCreateProduct, createProduct);
router.put("/:id", validateProductId, validateUpdateProduct, updateProduct);
router.patch("/:id", validateProductId, validateUpdateProduct, updateProduct);
router.delete("/:id", validateProductId, deleteProduct);

export default router;
