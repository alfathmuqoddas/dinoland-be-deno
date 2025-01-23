import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import sequelize from "../../db.js";

class ProductCategory extends Model<
  InferAttributes<ProductCategory>,
  InferCreationAttributes<ProductCategory>
> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare description: string;
}

ProductCategory.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING, allowNull: false },
  },
  { sequelize, modelName: "ProductCategory" }
);

export default ProductCategory;
