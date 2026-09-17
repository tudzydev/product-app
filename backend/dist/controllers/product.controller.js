"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedProductsController = exports.getStats = exports.getCategories = exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProductById = exports.getAllProducts = void 0;
const sequelize_1 = require("sequelize");
const models_1 = require("../models");
const product_seeder_1 = require("../seeders/product.seeder");
const getAllProducts = async (req, res, next) => {
    try {
        const page = Math.max(1, parseInt(req.query.page, 10) || 1);
        const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 10));
        const offset = (page - 1) * limit;
        const { search, category, minPrice, maxPrice, inStock, isActive, sortBy = "createdAt", order = "DESC", } = req.query;
        const where = {};
        // Keyword search across name, description, and SKU
        if (search && typeof search === "string" && search.trim() !== "") {
            const searchTerm = `%${search.trim()}%`;
            // Postgres supports iLike (case-insensitive)
            const isPostgres = models_1.sequelize.getDialect() === "postgres";
            const likeOp = isPostgres ? sequelize_1.Op.iLike : sequelize_1.Op.like;
            where[sequelize_1.Op.or] = [
                { name: { [likeOp]: searchTerm } },
                { description: { [likeOp]: searchTerm } },
                { sku: { [likeOp]: searchTerm } },
            ];
        }
        // Category filter
        if (category && typeof category === "string" && category.trim() !== "") {
            where.category = category.trim();
        }
        // Price range filters
        if (minPrice !== undefined || maxPrice !== undefined) {
            where.price = {};
            if (minPrice !== undefined && !isNaN(Number(minPrice))) {
                where.price[sequelize_1.Op.gte] = Number(minPrice);
            }
            if (maxPrice !== undefined && !isNaN(Number(maxPrice))) {
                where.price[sequelize_1.Op.lte] = Number(maxPrice);
            }
        }
        // Stock availability filter
        if (inStock !== undefined) {
            if (inStock === "true") {
                where.stock = { [sequelize_1.Op.gt]: 0 };
            }
            else if (inStock === "false") {
                where.stock = 0;
            }
        }
        // Active status filter
        if (isActive !== undefined) {
            if (isActive === "true") {
                where.isActive = true;
            }
            else if (isActive === "false") {
                where.isActive = false;
            }
        }
        // Sorting
        const allowedSortFields = [
            "id",
            "name",
            "price",
            "stock",
            "category",
            "createdAt",
            "updatedAt",
        ];
        const sortField = allowedSortFields.includes(sortBy)
            ? sortBy
            : "createdAt";
        const sortOrder = String(order).toUpperCase() === "ASC" ? "ASC" : "DESC";
        const { count, rows: products } = await models_1.Product.findAndCountAll({
            where,
            limit,
            offset,
            order: [[sortField, sortOrder]],
        });
        const totalPages = Math.ceil(count / limit) || 1;
        res.status(200).json({
            success: true,
            data: products,
            pagination: {
                total: count,
                page,
                limit,
                totalPages,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getAllProducts = getAllProducts;
const getProductById = async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        const product = await models_1.Product.findByPk(id);
        if (!product) {
            res.status(404).json({
                success: false,
                message: `Product with ID ${id} not found`,
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: product,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getProductById = getProductById;
const createProduct = async (req, res, next) => {
    try {
        const { name, description, price, category, stock, imageUrl, sku, isActive } = req.body;
        if (sku) {
            const existing = await models_1.Product.findOne({ where: { sku: sku.trim() } });
            if (existing) {
                res.status(409).json({
                    success: false,
                    message: `Product with SKU '${sku}' already exists`,
                });
                return;
            }
        }
        const product = await models_1.Product.create({
            name: name.trim(),
            description: description ? description.trim() : null,
            price: Number(price),
            category: category ? category.trim() : "General",
            stock: stock !== undefined ? Number(stock) : 0,
            imageUrl: imageUrl ? imageUrl.trim() : null,
            sku: sku ? sku.trim() : null,
            isActive: isActive !== undefined ? Boolean(isActive) : true,
        });
        res.status(201).json({
            success: true,
            message: "Product created successfully",
            data: product,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.createProduct = createProduct;
const updateProduct = async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        const product = await models_1.Product.findByPk(id);
        if (!product) {
            res.status(404).json({
                success: false,
                message: `Product with ID ${id} not found`,
            });
            return;
        }
        const { name, description, price, category, stock, imageUrl, sku, isActive } = req.body;
        // Check SKU conflict with other products
        if (sku && sku.trim() !== product.sku) {
            const existing = await models_1.Product.findOne({
                where: {
                    sku: sku.trim(),
                    id: { [sequelize_1.Op.ne]: id },
                },
            });
            if (existing) {
                res.status(409).json({
                    success: false,
                    message: `Another product with SKU '${sku}' already exists`,
                });
                return;
            }
        }
        const updateData = {};
        if (name !== undefined)
            updateData.name = name.trim();
        if (description !== undefined)
            updateData.description = description ? description.trim() : null;
        if (price !== undefined)
            updateData.price = Number(price);
        if (category !== undefined)
            updateData.category = category.trim();
        if (stock !== undefined)
            updateData.stock = Number(stock);
        if (imageUrl !== undefined)
            updateData.imageUrl = imageUrl ? imageUrl.trim() : null;
        if (sku !== undefined)
            updateData.sku = sku ? sku.trim() : null;
        if (isActive !== undefined)
            updateData.isActive = Boolean(isActive);
        await product.update(updateData);
        res.status(200).json({
            success: true,
            message: "Product updated successfully",
            data: product,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.updateProduct = updateProduct;
const deleteProduct = async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        const product = await models_1.Product.findByPk(id);
        if (!product) {
            res.status(404).json({
                success: false,
                message: `Product with ID ${id} not found`,
            });
            return;
        }
        await product.destroy();
        res.status(200).json({
            success: true,
            message: `Product with ID ${id} deleted successfully`,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteProduct = deleteProduct;
const getCategories = async (req, res, next) => {
    try {
        const categories = await models_1.Product.findAll({
            attributes: [
                "category",
                [models_1.sequelize.fn("COUNT", models_1.sequelize.col("id")), "productCount"],
            ],
            group: ["category"],
            order: [["category", "ASC"]],
            raw: true,
        });
        res.status(200).json({
            success: true,
            data: categories.map((c) => ({
                category: c.category,
                productCount: parseInt(c.productCount, 10) || 0,
            })),
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getCategories = getCategories;
const getStats = async (req, res, next) => {
    try {
        const totalProducts = await models_1.Product.count();
        const activeProducts = await models_1.Product.count({ where: { isActive: true } });
        const outOfStock = await models_1.Product.count({ where: { stock: 0 } });
        const inStock = await models_1.Product.count({ where: { stock: { [sequelize_1.Op.gt]: 0 } } });
        const aggregates = await models_1.Product.findAll({
            attributes: [
                [models_1.sequelize.fn("SUM", models_1.sequelize.col("stock")), "totalUnits"],
                [models_1.sequelize.literal("SUM(price * stock)"), "totalInventoryValue"],
                [models_1.sequelize.fn("AVG", models_1.sequelize.col("price")), "averagePrice"],
            ],
            raw: true,
        });
        const stats = aggregates[0] || {};
        res.status(200).json({
            success: true,
            data: {
                totalProducts,
                activeProducts,
                inStock,
                outOfStock,
                totalUnits: parseInt(stats.totalUnits, 10) || 0,
                totalInventoryValue: parseFloat(stats.totalInventoryValue) || 0,
                averagePrice: parseFloat(parseFloat(stats.averagePrice || 0).toFixed(2)),
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getStats = getStats;
const seedProductsController = async (req, res, next) => {
    try {
        const force = req.body?.force === true || req.query?.force === "true";
        const result = await (0, product_seeder_1.seedDatabase)(force);
        res.status(200).json({
            success: true,
            message: result.message,
            count: result.count,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.seedProductsController = seedProductsController;
