const { CREATED, SuccessResponse } = require("../core/success.response");
const AccessService = require("../services/access.service");

class AccessController {
  async handlerRefreshToken(req, res, next) {
    // new SuccessResponse({
    //   message: "Refresh token OK",
    //   metadata: await AccessService.handlerRefreshToken(req.body.refreshToken),
    // }).send(res);

    new SuccessResponse({
      message: "Refresh token OK",
      metadata: await AccessService.handlerRefreshTokenV2({
        refreshToken: req.refreshToken,
        user: req.user,
        keyStore: req.keyStore,
      }),
    }).send(res);
  }

  async logout(req, res, next) {
    new SuccessResponse({
      message: "Logout OK",
      metadata: await AccessService.logout({
        keyStore: req.keyStore,
      }),
    }).send(res);
  }

  async login(req, res, next) {
    new SuccessResponse({
      metadata: await AccessService.login(req.body),
    }).send(res);
  }

  /**
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @returns {Promise<*>}
   */
  async signUp(req, res, next) {
    new CREATED({
      message: "Registered OK",
      metadata: await AccessService.signUp(req.body),
    }).send(res);
  }
}

module.exports = new AccessController();
