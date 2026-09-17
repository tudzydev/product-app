"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = exports.connectDB = exports.sequelize = void 0;
const database_1 = require("../config/database");
Object.defineProperty(exports, "sequelize", { enumerable: true, get: function () { return database_1.sequelize; } });
Object.defineProperty(exports, "connectDB", { enumerable: true, get: function () { return database_1.connectDB; } });
const product_model_1 = __importDefault(require("./product.model"));
exports.Product = product_model_1.default;
exports.default = { sequelize: database_1.sequelize, connectDB: database_1.connectDB, Product: product_model_1.default };
