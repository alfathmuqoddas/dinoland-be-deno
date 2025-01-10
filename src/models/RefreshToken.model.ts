import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../db.js";

interface RefreshTokenAttributes {
  id: number;
  token: string;
  userId: number;
}

interface RefreshTokenCreationAttributes
  extends Optional<RefreshTokenAttributes, "id"> {}

class RefreshToken
  extends Model<RefreshTokenAttributes, RefreshTokenCreationAttributes>
  implements RefreshTokenAttributes
{
  declare id: number;
  declare token: string;
  declare userId: number;
}

RefreshToken.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    token: { type: DataTypes.STRING, allowNull: false },
    userId: { type: DataTypes.INTEGER, allowNull: false },
  },
  { sequelize, modelName: "RefreshToken" }
);

export default RefreshToken;
