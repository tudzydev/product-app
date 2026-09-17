import { sequelize, connectDB } from "../config/database";
import Product from "./product.model";

export { sequelize, connectDB, Product };
export default { sequelize, connectDB, Product };
