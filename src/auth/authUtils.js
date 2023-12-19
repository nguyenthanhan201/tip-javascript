"use strict";

const JWT = require("jsonwebtoken");
const asyncHandler = require("../helpers/asyncHandler");
const { AuthFailureError, NotFoundError } = require("../core/error.response");
const KeyTokenService = require("../services/keyToken.service");

const HEADER = {
  API_KEY: "x-api-key",
  CLIENT_ID: "x-client-id",
  AUTHORIZATION: "authorization",
  REFRESHTOKEN: "x-rtoken-id",
};

const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    const accessToken = await JWT.sign(payload, publicKey, {
      expiresIn: "1d",
    });

    const refreshToken = await JWT.sign(payload, privateKey, {
      expiresIn: "7d",
    });

    return {
      accessToken,
      refreshToken,
    };
  } catch (error) {}
};

const authentication = asyncHandler(async (req, res, next) => {
  /*
    1. check userId missing
    2. get accessToken
    3. verifyToken
    4. check user in dbs
    5. check keyStore with this userId
    6. ok all -> return next()
  */

  const userId = req.headers[HEADER.CLIENT_ID]?.toString();

  if (!userId) throw new AuthFailureError("Invalid request");

  const keyStore = await KeyTokenService.findByUserId(userId);
  // console.log("👌  keyStore:", keyStore);

  if (!keyStore) throw new NotFoundError("KeyStore not found");

  const accessToken = req.headers[HEADER.AUTHORIZATION]?.toString();

  if (!accessToken) throw new AuthFailureError("Invalid request");

  try {
    const decodeUser = JWT.verify(accessToken, keyStore.publicKey);

    if (userId !== decodeUser.userId)
      throw new AuthFailureError("Invalid Userid");

    req.keyStore = keyStore;
    return next();
  } catch (error) {
    console.log("👌  error:", error);
    throw error;
  }
});

const authenticationV2 = asyncHandler(async (req, res, next) => {
  /*
    1. check userId missing
    2. get accessToken
    3. verifyToken
    4. check user in dbs
    5. check keyStore with this userId
    6. ok all -> return next()
  */

  const userId = req.headers[HEADER.CLIENT_ID]?.toString();
  // console.log("👌  userId:", userId);

  if (!userId) throw new AuthFailureError("Invalid request");

  const keyStore = await KeyTokenService.findByUserId(userId);
  // console.log("👌  keyStore:", keyStore);

  if (!keyStore) throw new NotFoundError("KeyStore not found");

  if (req.headers[HEADER.REFRESHTOKEN]) {
    try {
      const refreshToken = req.headers[HEADER.REFRESHTOKEN];

      const decodeUser = JWT.verify(refreshToken, keyStore.privateKey);
      // console.log("👌  decodeUser:", decodeUser);
      if (userId !== decodeUser.userId)
        throw new AuthFailureError("Invalid Userid");
      req.keyStore = keyStore;
      req.user = decodeUser;
      req.refreshToken = refreshToken;
      return next();
    } catch (error) {
      throw error;
    }
  }

  if (!accessToken) throw new AuthFailureError("Invalid request");

  try {
    const decodeUser = JWT.verify(accessToken, keyStore.publicKey);

    if (userId !== decodeUser.userId)
      throw new AuthFailureError("Invalid Userid");

    req.keyStore = keyStore;
    return next();
  } catch (error) {
    throw error;
  }
});

const verifyJWT = async (token, keySecret) => JWT.verify(token, keySecret);

module.exports = {
  createTokenPair,
  authentication,
  verifyJWT,
  authenticationV2,
};
