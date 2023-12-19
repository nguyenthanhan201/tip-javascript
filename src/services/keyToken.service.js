"use strict";

const keytokenModel = require("../models/keytoken.model");

class KeyTokenService {
  static createKeyToken = async ({
    userId,
    publicKey,
    privateKey,
    refreshToken,
  }) => {
    try {
      // const token = await keytokenModel.create({
      //   user: userId,
      //   publicKey,
      //   privateKey,
      // });
      // return token ? token.publicKey : null;

      const filter = {
          user: userId,
        },
        update = {
          publicKey,
          privateKey,
          refreshTokenUsed: [],
          refreshToken,
        },
        options = { upsert: true, new: true };

      const tokens = await keytokenModel.findOneAndUpdate(
        filter,
        update,
        options
      );

      return tokens ? tokens.publicKey : null;
    } catch (error) {
      return error;
    }
  };

  static findByUserId = async (userId) =>
    await keytokenModel.findOne({ user: userId });

  static removeKeyById = async (id) =>
    await keytokenModel.findByIdAndDelete(id);

  static deleteKeyByUserId = async (userId) =>
    await keytokenModel.deleteOne({ user: userId });

  static findByRefreshTokenUsed = async (refreshToken) =>
    await keytokenModel
      .findOne({
        refreshTokensUsed: refreshToken,
      })
      .lean();

  static findByRefreshToken = async (refreshToken) =>
    await keytokenModel.findOne({
      refreshToken,
    });
}

module.exports = KeyTokenService;
