"use strict";

const { getAllDiscountAmount } = require("../services/discount.service");
const { BadRequestError } = require("../core/error.response");
const { findCartById } = require("../models/repositories/cart.repo,");
const { checkProductByServer } = require("../models/repositories/product.repo");
const { acquireLock, releaseLock } = require("./redis.service");
const { order } = require("../models/order.model");

// login and without login
/*
    {
        cardId,
        userId,
        shop_order_ids:[
            {
            shopId,
            shop_discount:[]
            shop_order_items:[],
            item_product :[
                    {
                    price,
                    quantity,
                    productId
                    }
                ]
                
            },
            {
            shopId,
            shop_discount:[]
            shop_order_items:[
                {
                    "shopId",
                    "discountId",
                    "codeId"
                }
            ],
            item_product :[
                    {
                    price,
                    quantity,
                    productId
                    }
                ]
                
            }
        ]
    }

*/
class CheckoutService {
  static async checkoutReview({ cartId, userId, shop_order_ids }) {
    // Tìm giỏ hàng dựa trên cartId
    const foundCart = await findCartById(cartId);
    if (!foundCart) throw new BadRequestError("Cart does not exist!");

    // Khởi tạo biến lưu thông tin về đơn hàng
    const checkout_order = {
      totalPrice: 0, // Tổng giá trị sản phẩm
      feeShip: 0,
      totalDiscount: 0, // Tổng giá trị giảm giá
      totalCheckout: 0,
    };

    // Mảng lưu thông tin chi tiết của từng đơn hàng
    const shop_order_ids_new = [];

    // Vòng lặp qua mỗi đơn hàng
    for (const i = 0; i < shop_order_ids.length; i++) {
      const {
        shopId,
        shop_discount = [],
        item_products = [],
      } = shop_order_ids[i];

      // Kiểm tra tính hợp lệ của sản phẩm trong đơn hàng
      const checkoutProductServer = await checkProductByServer(item_products);
      if (!checkoutProductServer) {
        throw new BadRequestError("Invalid order!");
      }

      // Tính tổng giá trị sản phẩm trong đơn hàng
      const checkoutPrice = checkoutProductServer.reduce(
        (totalPrice, product) => {
          return totalPrice + product.quantity * product.price;
        },
        0
      );

      // Tính tổng giá trị sản phẩm trước khi xử lý
      checkout_order.totalPrice += checkoutPrice;

      // Tạo đối tượng thông tin đơn hàng
      let itemCheckout = {
        shopId,
        shop_discounts: shop_discount, // Mảng các mã giảm giá
        priceRaw: checkoutPrice, // Giá trị trước khi giảm giá
        priceApplyDiscount: checkoutPrice, // Giá trị sau khi giảm giá
        item_products: checkoutProductServer, // Sản phẩm trong đơn hàng
      };

      // Kiểm tra nếu có mã giảm giá
      if (shop_discount.length > 0) {
        const { totalPrice, discount } = await getAllDiscountAmount({
          codeId: shop_discount[0].codeId,
          userId,
          shopId,
          product: checkoutProductServer,
        });

        // Cập nhật tổng giá trị giảm giá
        checkout_order.totalDiscount += discount;

        // Nếu có giảm giá, cập nhật giá trị sau khi giảm giá
        if (discount > 0) {
          itemCheckout.priceApplyDiscount = checkoutPrice - discount;
        }
      }

      // Tính tổng thanh toán cuối cùng cho đơn hàng
      checkout_order.totalCheckout += itemCheckout.priceApplyDiscount;

      // Thêm thông tin đơn hàng vào mảng shop_order_ids_new
      shop_order_ids_new.push(itemCheckout);
    }

    // Trả về thông tin về đơn hàng
    return {
      shop_order_ids,
      shop_order_ids_new,
      checkout_order,
    };
  }

  static async orderByUser({
    shop_order_ids,
    cartId,
    userId,
    user_address = {},
    user_payment = {},
  }) {
    const { shop_order_ids_new, checkout_order } =
      await CheckoutService.checkoutReview({
        cartId,
        userId,
        shop_order_ids,
      });

    const products = shop_order_ids_new.flatMap((order) => order.item_products);
    const acquireProduct = [];
    for (const i = 0; i < products.length; i++) {
      const { productId, quantity } = products[i];
      const keyLock = await acquireLock(productId, quantity, cartId);
      acquireProduct.push(keyLock ? true : false);
      if (keyLock) {
        await releaseLock(keyLock);
      }
    }

    if (acquireProduct.includes(false)) {
      throw new BadRequestError(
        "mot so san pham da duoc cap nhat, vui long quay lai gio hang"
      );
    }
    const newOrder = await order.create({
      order_userId: userId,
      order_checkout: checkout_order,
      order_shipping: user_address,
      order_payment: user_payment,
      order_products: shop_order_ids_new,
    });


    // insert thanh cong remove product co trong gio hang
    if (newOrder) {
      // remove product in cart
    }
    return newOrder;
  }
}

module.exports = CheckoutService;
