import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";

export interface ProductAttributes {
  id: number;
  name: string;
  description: string | null;
  price: number;
  category: string;
  stock: number;
  imageUrl: string | null;
  sku: string | null;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProductCreationAttributes
  extends Optional<
    ProductAttributes,
    "id" | "description" | "imageUrl" | "sku" | "isActive" | "createdAt" | "updatedAt"
  > {}

export class Product
  extends Model<ProductAttributes, ProductCreationAttributes>
  implements ProductAttributes
{
  declare id: number;
  declare name: string;
  declare description: string | null;
  declare price: number;
  declare category: string;
  declare stock: number;
  declare imageUrl: string | null;
  declare sku: string | null;
  declare isActive: boolean;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Product.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(255),
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
      type: DataTypes.TEXT,
      allowNull: true,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        isDecimal: { msg: "Price must be a valid number" },
        min: { args: [0], msg: "Price cannot be negative" },
      },
      get() {
        const value = this.getDataValue("price");
        return value === null ? 0 : parseFloat(value as unknown as string);
      },
    },
    category: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: "General",
      validate: {
        notEmpty: { msg: "Category cannot be empty" },
      },
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        isInt: { msg: "Stock must be an integer" },
        min: { args: [0], msg: "Stock cannot be negative" },
      },
    },
    imageUrl: {
      type: DataTypes.STRING(1024),
      allowNull: true,
      validate: {
        isUrl: {
          msg: "Image URL must be a valid URL",
        },
      },
    },
    sku: {
      type: DataTypes.STRING(100),
      allowNull: true,
      unique: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: "products",
    timestamps: true,
    indexes: [
      { fields: ["category"] },
      { fields: ["price"] },
      { fields: ["isActive"] },
      { fields: ["sku"], unique: true },
    ],
  }
);

export default Product;
