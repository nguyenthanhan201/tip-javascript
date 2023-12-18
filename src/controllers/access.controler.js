const { CREATED } = require("../core/success.response");
const AccessService = require("../services/access.service");

class AccessController {
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
