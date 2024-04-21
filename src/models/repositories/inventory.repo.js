const { convertToObjectIdMongodb } = require("../../utils");
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

const reservationInventory = async ({ productId, quantity, cardIt }) => {
  const query = {
      inven_productId: convertToObjectIdMongodb(productId),
      inven_stock: { $gte: quantity },
    },
    updateSet = {
      $inc: {
        inven_stock: -quantity,
      },
      $push: {
        inven_reservations: {
          quantity, 
          cartId,
          createOn: new Date(),
        },
      },
    },
    option = { upsert: true, new: true };
  return await inventory.updateOne(query, updateSet);
};

module.exports = {
  insertInventory,
  reservationInventory
};
