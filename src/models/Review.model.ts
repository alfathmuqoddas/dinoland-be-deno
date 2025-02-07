import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../db.js";

interface ReviewAttributes {
  id: number;
  userId: number;
  productId: number;
  rating: number;
  reviewContent: string;
}

interface ReviewCreationAttributes extends Optional<ReviewAttributes, "id"> {}

class Review
  extends Model<ReviewAttributes, ReviewCreationAttributes>
  implements ReviewAttributes
{
  declare id: number;
  declare userId: number;
  declare productId: number;
  declare rating: number;
  declare reviewContent: string;
}

Review.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    productId: { type: DataTypes.INTEGER, allowNull: false },
    rating: { type: DataTypes.INTEGER, allowNull: false },
    reviewContent: { type: DataTypes.STRING, allowNull: false },
  },
  { sequelize, modelName: "Review" }
);

export default Review;
