import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../db.js";

// Define the attributes for the User model
interface UserAttributes {
  id: number;
  name: string;
  email: string;
  password: string;
}

// Define optional attributes for creation
interface UserCreationAttributes extends Optional<UserAttributes, "id"> {}

// Define the User model
class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  declare id: number;
  declare name: string;
  declare email: string;
  declare password: string;
}

User.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
  },
  { sequelize, modelName: "User" }
);

export default User;
