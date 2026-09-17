"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const product_controller_1 = require("../controllers/product.controller");
const validator_1 = require("../middleware/validator");
const router = (0, express_1.Router)();
// Special collection routes (MUST be defined before /:id)
router.get("/stats", product_controller_1.getStats);
router.get("/categories", product_controller_1.getCategories);
router.post("/seed", product_controller_1.seedProductsController);
// Standard CRUD routes
router.get("/", product_controller_1.getAllProducts);
router.get("/:id", validator_1.validateProductId, product_controller_1.getProductById);
router.post("/", validator_1.validateCreateProduct, product_controller_1.createProduct);
router.put("/:id", validator_1.validateProductId, validator_1.validateUpdateProduct, product_controller_1.updateProduct);
router.patch("/:id", validator_1.validateProductId, validator_1.validateUpdateProduct, product_controller_1.updateProduct);
router.delete("/:id", validator_1.validateProductId, product_controller_1.deleteProduct);
exports.default = router;
