"use strict";
const jwt = require("jsonwebtoken");
const asyncHandler = require("../helpers/asyncHandler");
const { AuthFailureError, NotFoundError } = require("../core/error.response");
const { findByUserId } = require("../services/keyToken.service");
const HEADER = {
  API_KEY: "x-api-key",
  AUTHORIZATION: "authorization",
  CLIENT_ID: "x-client-id",
  REFRESHTOKEN: "refreshToken",
};

const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    const accessToken = await jwt.sign(payload, publicKey, {
      expiresIn: "2 days",
    });
    const refreshToken = await jwt.sign(payload, privateKey, {
      expiresIn: "7 days",
    });

    jwt.verify(accessToken, publicKey, (err, decode) => {
      if (err) {
        console.log("Error verifying token:", err);
      } else {
        console.log("decode verify", decode);
      }
    });
    return { accessToken, refreshToken };
  } catch (e) {
    throw e;
  }
};

const authentication = asyncHandler(async (req, res, next) => {
  /* 1. Check userId missing??
  2 .get accessToken
  3. verifyToken
  4. check user in dbs
  5, Check keystore with this userId
  6. Return next
  */

  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId) throw new AuthFailureError("userId Invalid request");

  //2
  const keyStore = await findByUserId(userId);
  if (!keyStore) throw new NotFoundError("keyStore not found request");

  //3
  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken) throw new NotFoundError("accessToken not found request");

  try {
    const decodeUser = jwt.verify(accessToken, keyStore.publicKey);
    if (userId !== decodeUser.userId)
      throw new AuthFailureError("Invalid decodeUser");
    console.log("check decode", decodeUser);

    req.keyStore = keyStore;
    req.user = decodeUser;
    return next();
  } catch (error) {
    throw error;
  }
});
const authenticationV2 = asyncHandler(async (req, res, next) => {
  /* 1. Check userId missing??
  2 .get accessToken
  3. verifyToken
  4. check user in dbs
  5, Check keystore with this userId
  6. Return next
  */

  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId) throw new AuthFailureError("userId Invalid request");

  //2
  const keyStore = await findByUserId(userId);
  if (!keyStore) throw new NotFoundError("keyStore not found request");

  if (req.headers[HEADER.REFRESHTOKEN]) {
    try {
      const refreshToken = req.headers[HEADER.REFRESHTOKEN];
      const decodeUser = jwt.verify(refreshToken, keyStore.privateKey);
      if (userId !== decodeUser.userId)
        throw new AuthFailureError("Invalid decodeUser");
      console.log("check decode", decodeUser);
      req.keyStore = keyStore;
      req.user = decodeUser;
      req.refreshToken = refreshToken;
    } catch (error) {
      throw error;
    }
  }
  //3
  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken) throw new NotFoundError("accessToken not found request");

  try {
    const decodeUser = jwt.verify(accessToken, keyStore.publicKey);
    if (userId !== decodeUser.userId)
      throw new AuthFailureError("Invalid decodeUser");
    req.keyStore = keyStore;
    return next();
  } catch (error) {
    throw error;
  }
});

const verifyToken = (token, keySecret) => {
  const decodedToken = jwt.verify(token, keySecret);
  return decodedToken;
};

module.exports = {
  createTokenPair,
  authentication,
  verifyToken,
  authenticationV2,
};
