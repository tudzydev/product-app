"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
class Product extends sequelize_1.Model {
}
exports.Product = Product;
Product.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
        validate: {
            notEmpty: { msg: "Product name cannot be empty" },
            len: {
                args: [2, 255],
                msg: "Product name must be between 2 and 255 characters",
            },
        },
    },
    description: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
    price: {
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            isDecimal: { msg: "Price must be a valid number" },
            min: { args: [0], msg: "Price cannot be negative" },
        },
        get() {
            const value = this.getDataValue("price");
            return value === null ? 0 : parseFloat(value);
        },
    },
    category: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false,
        defaultValue: "General",
        validate: {
            notEmpty: { msg: "Category cannot be empty" },
        },
    },
    stock: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
            isInt: { msg: "Stock must be an integer" },
            min: { args: [0], msg: "Stock cannot be negative" },
        },
    },
    imageUrl: {
        type: sequelize_1.DataTypes.STRING(1024),
        allowNull: true,
        validate: {
            isUrl: {
                msg: "Image URL must be a valid URL",
            },
        },
    },
    sku: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: true,
        unique: true,
    },
    isActive: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
}, {
    sequelize: database_1.sequelize,
    tableName: "products",
    timestamps: true,
    indexes: [
        { fields: ["category"] },
        { fields: ["price"] },
        { fields: ["isActive"] },
        { fields: ["sku"], unique: true },
    ],
});
exports.default = Product;
