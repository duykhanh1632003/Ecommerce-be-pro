"use strict";

const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair, verifyToken } = require("../auth/authUtils");
const { getInfoData } = require("../utils");
const {
  BadRequestError,
  AuthFailureError,
  RefreshTokenError,
} = require("../core/error.response");
const findByEmail = require("./shop.service");
const keyTokenModel = require("../models/keyToken.model");
const RoleShop = {
  SHOPE: "SHOP",
  WRITER: "WRITER",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};

class AccessService {
  static handlerRefreshToken = async (refreshToken) => {
    // Tìm ra refreshToken được sử dụng hay chưa
    const foundToken = await KeyTokenService.foundByRefreshTokenUsed(
      refreshToken
    );
    console.log("Check refresh", foundToken);
    if (foundToken) {
      const { userId, email } = await verifyToken(
        refreshToken,
        foundToken.privateKey
      );
      await KeyTokenService.deleteKeyById(userId);
      throw new RefreshTokenError("Phiên đăng nhập của bạn đã hết hạn");
    }

    // Nếu chưa thì tiếp tục xác thực
    const holderShop = await KeyTokenService.findByRefreshToken(refreshToken);
    if (!holderShop) throw new BadRequestError("Shop này chưa được đăng ký 1");
    const { userId, email } = verifyToken(refreshToken, holderShop.privateKey);
    const foundShop = await findByEmail({ email });
    if (!foundShop) throw new BadRequestError("Shop này chưa được đăng ký 2");

    const tokens = await createTokenPair(
      { userId, email },
      holderShop.publicKey,
      holderShop.privateKey
    );
    await keyTokenModel.updateOne(
      { _id: holderShop._id },
      {
        $set: {
          refreshToken: tokens.refreshToken,
        },
        $addToSet: {
          refreshTokensUsed: refreshToken,
        },
      }
    );

    return { user: { userId, email }, tokens };
  };

  static handlerRefreshTokenV2 = async ({ keyStore, user, refreshToken }) => {
    const { userId, email } = user;
    if (keyStore.refreshTokensUsed.includes(refreshToken)) {
      await KeyTokenService.deleteKeyById(userId);
      throw new RefreshTokenError("Phiên đăng nhập của bạn đã hết hạn");
    }
    if (keyStore.refreshToken !== refreshToken) {
      throw new BadRequestError("Shop này chưa được đăng ký 1");
    }
    const foundShop = await findByEmail({ email });
    if (!foundShop) throw new BadRequestError("Shop này chưa được đăng ký 2");

    const tokens = await createTokenPair(
      { userId, email },
      keyStore.publicKey,
      keyStore.privateKey 
    );
    await keyTokenModel.updateOne(
      { _id: userId },
      {
        $set: {
          refreshToken: tokens.refreshToken,
        },
        $addToSet: {
          refreshTokensUsed: refreshToken,
        },
      }
    );

    return { user, tokens };
  };

  static logout = async (keystore) => {
    const deleteKey = await KeyTokenService.removeKeyById(keystore._id);
    return deleteKey;
  };
  static login = async ({ email, password, refreshToken = null }) => {
    const foundShop = await findByEmail({ email });
    if (!foundShop) {
      throw BadRequestError("Shop not registered");
    }

    const match = await bcrypt.compare(password, foundShop.password);
    if (!match) {
      throw new AuthFailureError("Password Incorrect");
    }

    const privateKey = crypto.randomBytes(64).toString("hex");
    const publicKey = crypto.randomBytes(64).toString("hex");

    const tokens = await createTokenPair(
      { userId: foundShop._id, email },
      publicKey,
      privateKey
    );
    await KeyTokenService.createKeyToken({
      refreshToken: tokens.refreshToken,
      privateKey,
      publicKey,
      userId: foundShop._id,
    });
    return {
      shop: getInfoData({
        fields: ["_id", "name", "email"],
        object: foundShop,
      }),
      tokens,
    };
  };
  static signUp = async ({ name, email, password }) => {
    try {
      const holderShop = await shopModel.findOne({ email }).lean();
      if (holderShop) {
        throw new BadRequestError("Error: Shop already registered");
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const newShop = await shopModel.create({
        name,
        email,
        password: passwordHash,
        roles: [RoleShop.SHOPE],
      });

      if (newShop) {
        const privateKey = crypto.randomBytes(64).toString("hex");
        const publicKey = crypto.randomBytes(64).toString("hex");

        const keyStore = await KeyTokenService.createKeyToken({
          userId: newShop._id,
          publicKey,
          privateKey,
        });
        if (!keyStore) {
          throw new BadRequestError("Error: keyStore Error");
        }
        const tokens = await createTokenPair(
          { userId: newShop._id, email },
          publicKey,
          privateKey
        );
        console.log("created tokens", tokens);
        return {
          code: 201,
          metaData: {
            shop: getInfoData({
              fields: ["_id", "name", "email"],
              object: newShop,
            }),
            tokens,
          },
        };
      }
      return { code: 200, metaData: null };
    } catch (e) {
      return {
        code: "xxx",
        message: e.message,
        status: "error",
      };
    }
  };
}

module.exports = AccessService;
