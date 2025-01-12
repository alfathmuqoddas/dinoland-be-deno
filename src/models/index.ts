import Product from "@/models/Products.model.ts";
import User from "@/models/User.model.ts";
import Cart from "@/models/Cart.model.ts";
import RefreshToken from "@/models/RefreshToken.model.ts";

Cart.belongsTo(Product, { foreignKey: "productId" });
Cart.belongsTo(User, { foreignKey: "userId" });

Product.hasMany(Cart, { foreignKey: "productId" });

User.hasMany(Cart, { foreignKey: "userId" });

export { Cart, Product, User, RefreshToken };
