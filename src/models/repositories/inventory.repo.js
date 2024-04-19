const { inventory } = require("../inventory.model");

const insertInventory = async ({
  productId,
  shopId,
  stock,
  location = "unKnow",
}) => {
  return await inventory.create({
    inven_productId: productId,
    inven_stock: stock,
    inven_location: location, // Không cần lặp lại inven_productId ở đây
    inven_shopId: shopId,
  });
};

module.exports = {
  insertInventory,
};
