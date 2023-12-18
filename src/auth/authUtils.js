"use strict";

const JWT = require("jsonwebtoken");

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

module.exports = {
  createTokenPair,
};
