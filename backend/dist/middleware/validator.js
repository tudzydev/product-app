"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUpdateProduct = exports.validateCreateProduct = exports.validateProductId = void 0;
const validateProductId = (req, res, next) => {
    const id = Number(req.params.id);
    if (!id || !Number.isInteger(id) || id <= 0) {
        res.status(400).json({
            success: false,
            message: "Invalid product ID. ID must be a positive integer.",
        });
        return;
    }
    next();
};
exports.validateProductId = validateProductId;
const validateCreateProduct = (req, res, next) => {
    const { name, price, stock, category, imageUrl, sku, isActive } = req.body;
    const errors = [];
    // Name validation
    if (!name || typeof name !== "string" || name.trim().length < 2) {
        errors.push("Field 'name' is required and must be at least 2 characters long.");
    }
    else if (name.trim().length > 255) {
        errors.push("Field 'name' must not exceed 255 characters.");
    }
    // Price validation
    if (price === undefined || price === null || price === "") {
        errors.push("Field 'price' is required.");
    }
    else {
        const numPrice = Number(price);
        if (isNaN(numPrice) || numPrice < 0) {
            errors.push("Field 'price' must be a non-negative number.");
        }
    }
    // Stock validation (optional on create, defaults to 0)
    if (stock !== undefined && stock !== null) {
        const numStock = Number(stock);
        if (!Number.isInteger(numStock) || numStock < 0) {
            errors.push("Field 'stock' must be a non-negative integer.");
        }
    }
    // Category validation
    if (category !== undefined && typeof category !== "string") {
        errors.push("Field 'category' must be a string.");
    }
    // Image URL validation
    if (imageUrl !== undefined && imageUrl !== null && imageUrl !== "") {
        if (typeof imageUrl !== "string") {
            errors.push("Field 'imageUrl' must be a string URL.");
        }
    }
    // SKU validation
    if (sku !== undefined && sku !== null && sku !== "") {
        if (typeof sku !== "string") {
            errors.push("Field 'sku' must be a string.");
        }
    }
    // isActive validation
    if (isActive !== undefined && typeof isActive !== "boolean") {
        errors.push("Field 'isActive' must be a boolean (true or false).");
    }
    if (errors.length > 0) {
        res.status(400).json({
            success: false,
            message: "Validation failed",
            errors,
        });
        return;
    }
    next();
};
exports.validateCreateProduct = validateCreateProduct;
const validateUpdateProduct = (req, res, next) => {
    const { name, price, stock, category, imageUrl, sku, isActive } = req.body;
    const errors = [];
    if (Object.keys(req.body).length === 0) {
        res.status(400).json({
            success: false,
            message: "Request body cannot be empty for an update.",
        });
        return;
    }
    // Name validation
    if (name !== undefined) {
        if (typeof name !== "string" || name.trim().length < 2) {
            errors.push("Field 'name' must be at least 2 characters long.");
        }
        else if (name.trim().length > 255) {
            errors.push("Field 'name' must not exceed 255 characters.");
        }
    }
    // Price validation
    if (price !== undefined) {
        const numPrice = Number(price);
        if (isNaN(numPrice) || numPrice < 0) {
            errors.push("Field 'price' must be a non-negative number.");
        }
    }
    // Stock validation
    if (stock !== undefined) {
        const numStock = Number(stock);
        if (!Number.isInteger(numStock) || numStock < 0) {
            errors.push("Field 'stock' must be a non-negative integer.");
        }
    }
    // Category validation
    if (category !== undefined && typeof category !== "string") {
        errors.push("Field 'category' must be a string.");
    }
    // Image URL validation
    if (imageUrl !== undefined && imageUrl !== null && imageUrl !== "") {
        if (typeof imageUrl !== "string") {
            errors.push("Field 'imageUrl' must be a string URL.");
        }
    }
    // SKU validation
    if (sku !== undefined && sku !== null && sku !== "") {
        if (typeof sku !== "string") {
            errors.push("Field 'sku' must be a string.");
        }
    }
    // isActive validation
    if (isActive !== undefined && typeof isActive !== "boolean") {
        errors.push("Field 'isActive' must be a boolean (true or false).");
    }
    if (errors.length > 0) {
        res.status(400).json({
            success: false,
            message: "Validation failed",
            errors,
        });
        return;
    }
    next();
};
exports.validateUpdateProduct = validateUpdateProduct;
