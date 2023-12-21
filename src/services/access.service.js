"use strict";

const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("node:crypto");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair, verifyJWT } = require("../auth/authUtils");
const { getInfoData } = require("../utils");
const {
  BadRequestError,
  AuthFailureError,
  ForbiddenError,
  NotFoundError,
} = require("../core/error.response");
const { findByEmail } = require("./shop.service");

const RoleShop = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};

class AccessService {
  static handlerRefreshTokenV2 = async ({ refreshToken, user, keyStore }) => {
    // console.log("👌  keyStore:", keyStore);
    const { userId, email } = user;

    if (keyStore.refreshTokensUsed.includes(refreshToken)) {
      await KeyTokenService.deleteKeyByUserId(userId);
      throw new ForbiddenError("Refresh token used");
    }

    if (keyStore.refreshToken !== refreshToken)
      throw new AuthFailureError("Shop not registered");

    const foundShop = await shopModel.findById(userId);
    if (!foundShop) throw new NotFoundError("Not found shop");

    const tokens = await createTokenPair(
      {
        userId,
        email,
      },
      keyStore.publicKey,
      keyStore.privateKey
    );

    await keyStore.updateOne({
      $set: {
        refreshToken: tokens.refreshToken,
      },
      $addToSet: {
        refreshTokensUsed: refreshToken,
      },
    });

    return {
      user: { userId, email },
      tokens,
    };
  };

  static handlerRefreshToken = async (refreshToken) => {
    const foundToken = await KeyTokenService.findByRefreshTokenUsed(
      refreshToken
    );
    // console.log("👌  foundToken:", foundToken);

    if (foundToken) {
      // decode xem may la thang nao?
      const { userId, email } = await verifyJWT(
        refreshToken,
        foundToken.privateKey
      );

      // console.log({ userId, email });

      await KeyTokenService.deleteKeyByUserId(userId);
      throw new ForbiddenError("Refresh token used");
    }

    const holderToken = await KeyTokenService.findByRefreshToken(refreshToken);

    if (!holderToken) throw new AuthFailureError("Something wrong happened !!");

    const { userId, email } = await verifyJWT(
      refreshToken,
      holderToken.privateKey
    );

    const foundShop = await shopModel.findById(userId).lean();
    if (!foundShop) throw new NotFoundError("Something wrong happened !!");

    const tokens = await createTokenPair(
      {
        userId,
        email,
      },
      holderToken.publicKey,
      holderToken.privateKey
    );

    await holderToken.updateOne({
      $set: {
        refreshToken: tokens.refreshToken,
      },
      $addToSet: {
        refreshTokensUsed: refreshToken,
      },
    });

    return {
      user: { userId, email },
      tokens,
    };
  };

  static logout = async ({ keyStore }) => {
    // console.log("👌  keyStore:", keyStore);
    const delKey = await KeyTokenService.removeKeyById(keyStore._id);

    console.log({ delKey });
    return delKey;
  };

  static login = async ({ email, password, refreshToken = null }) => {
    const foundShop = await findByEmail({ email });

    if (!foundShop) throw new BadRequestError("Error: shop not found");

    const match = await bcrypt.compare(password, foundShop.password);

    if (!match) throw new AuthFailureError("Authenication failure");

    const privateKey = crypto.randomBytes(64).toString("hex");
    const publicKey = crypto.randomBytes(64).toString("hex");

    const tokens = await createTokenPair(
      { userId: foundShop._id, email },
      publicKey,
      privateKey
    );

    await KeyTokenService.createKeyToken({
      userId: foundShop._id,
      refreshToken: tokens.refreshToken,
      privateKey,
      publicKey,
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
    // step1: check email exist
    a;
    const hodelShop = await shopModel.findOne({ email }).lean();
    if (hodelShop) {
      throw new BadRequestError("Error: shop already exists");
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newShop = await shopModel.create({
      name,
      email,
      password: passwordHash,
      roles: [RoleShop.SHOP],
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
        return {
          code: "xxx",
          message: "keyStore error",
        };
      }

      // created token pair
      const tokens = await createTokenPair(
        { userId: newShop._id, email },
        publicKey,
        privateKey
      );

      console.log(tokens);
      return {
        code: "201",
        metadata: {
          shop: getInfoData({
            fields: ["_id", "name", "email"],
            newShop,
          }),
          tokens,
        },
      };
    }

    return {
      code: 201,
      metadata: null,
    };
  };
}

module.exports = AccessService;
