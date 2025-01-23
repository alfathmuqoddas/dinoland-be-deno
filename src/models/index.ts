import Product from "@/models/Products.model.ts";
import User from "@/models/User.model.ts";
import Cart from "@/models/Cart.model.ts";
import RefreshToken from "@/models/RefreshToken.model.ts";
import ProductCategory from "@/models/ProductCategory.model.ts";

Cart.belongsTo(Product, { as: "items", foreignKey: "productId" });
Cart.belongsTo(User, { foreignKey: "userId" });

Product.hasMany(Cart, { as: "items", foreignKey: "productId" });
Product.hasMany(ProductCategory, {
  as: "categories",
  foreignKey: "categoryId",
});

User.hasMany(Cart, { foreignKey: "userId" });

export { Cart, Product, User, RefreshToken, ProductCategory };
