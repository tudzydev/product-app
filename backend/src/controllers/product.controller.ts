import { Request, Response, NextFunction } from "express";
import { Op, WhereOptions } from "sequelize";
import { Product, sequelize } from "../models";
import { seedDatabase } from "../seeders/product.seeder";

export const getAllProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
    const limit = Math.min(
      100,
      Math.max(1, parseInt(req.query.limit as string, 10) || 10)
    );
    const offset = (page - 1) * limit;

    const {
      search,
      category,
      minPrice,
      maxPrice,
      inStock,
      isActive,
      sortBy = "createdAt",
      order = "DESC",
    } = req.query;

    const where: WhereOptions<any> = {};

    // Keyword search across name, description, and SKU
    if (search && typeof search === "string" && search.trim() !== "") {
      const searchTerm = `%${search.trim()}%`;
      // Postgres supports iLike (case-insensitive)
      const isPostgres = sequelize.getDialect() === "postgres";
      const likeOp = isPostgres ? Op.iLike : Op.like;

      where[Op.or as any] = [
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
        where.price[Op.gte] = Number(minPrice);
      }
      if (maxPrice !== undefined && !isNaN(Number(maxPrice))) {
        where.price[Op.lte] = Number(maxPrice);
      }
    }

    // Stock availability filter
    if (inStock !== undefined) {
      if (inStock === "true") {
        where.stock = { [Op.gt]: 0 };
      } else if (inStock === "false") {
        where.stock = 0;
      }
    }

    // Active status filter
    if (isActive !== undefined) {
      if (isActive === "true") {
        where.isActive = true;
      } else if (isActive === "false") {
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
    const sortField = allowedSortFields.includes(sortBy as string)
      ? (sortBy as string)
      : "createdAt";
    const sortOrder =
      String(order).toUpperCase() === "ASC" ? "ASC" : "DESC";

    const { count, rows: products } = await Product.findAndCountAll({
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
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = Number(req.params.id);
    const product = await Product.findByPk(id);

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
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, description, price, category, stock, imageUrl, sku, isActive } =
      req.body;

    if (sku) {
      const existing = await Product.findOne({ where: { sku: sku.trim() } });
      if (existing) {
        res.status(409).json({
          success: false,
          message: `Product with SKU '${sku}' already exists`,
        });
        return;
      }
    }

    const product = await Product.create({
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
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = Number(req.params.id);
    const product = await Product.findByPk(id);

    if (!product) {
      res.status(404).json({
        success: false,
        message: `Product with ID ${id} not found`,
      });
      return;
    }

    const { name, description, price, category, stock, imageUrl, sku, isActive } =
      req.body;

    // Check SKU conflict with other products
    if (sku && sku.trim() !== product.sku) {
      const existing = await Product.findOne({
        where: {
          sku: sku.trim(),
          id: { [Op.ne]: id },
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

    const updateData: any = {};
    if (name !== undefined) updateData.name = name.trim();
    if (description !== undefined)
      updateData.description = description ? description.trim() : null;
    if (price !== undefined) updateData.price = Number(price);
    if (category !== undefined) updateData.category = category.trim();
    if (stock !== undefined) updateData.stock = Number(stock);
    if (imageUrl !== undefined)
      updateData.imageUrl = imageUrl ? imageUrl.trim() : null;
    if (sku !== undefined) updateData.sku = sku ? sku.trim() : null;
    if (isActive !== undefined) updateData.isActive = Boolean(isActive);

    await product.update(updateData);

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = Number(req.params.id);
    const product = await Product.findByPk(id);

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
  } catch (error) {
    next(error);
  }
};

export const getCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const categories = await Product.findAll({
      attributes: [
        "category",
        [sequelize.fn("COUNT", sequelize.col("id")), "productCount"],
      ],
      group: ["category"],
      order: [["category", "ASC"]],
      raw: true,
    });

    res.status(200).json({
      success: true,
      data: categories.map((c: any) => ({
        category: c.category,
        productCount: parseInt(c.productCount, 10) || 0,
      })),
    });
  } catch (error) {
    next(error);
  }
};

export const getStats = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const totalProducts = await Product.count();
    const activeProducts = await Product.count({ where: { isActive: true } });
    const outOfStock = await Product.count({ where: { stock: 0 } });
    const inStock = await Product.count({ where: { stock: { [Op.gt]: 0 } } });

    const aggregates: any = await Product.findAll({
      attributes: [
        [sequelize.fn("SUM", sequelize.col("stock")), "totalUnits"],
        [sequelize.literal("SUM(price * stock)"), "totalInventoryValue"],
        [sequelize.fn("AVG", sequelize.col("price")), "averagePrice"],
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
  } catch (error) {
    next(error);
  }
};

export const seedProductsController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const force = req.body?.force === true || req.query?.force === "true";
    const result = await seedDatabase(force);

    res.status(200).json({
      success: true,
      message: result.message,
      count: result.count,
    });
  } catch (error) {
    next(error);
  }
};
