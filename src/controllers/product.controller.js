const { SuccessResponse } = require("../core/success.response");
const ProductService = require("../services/product.service.xxx");

class ProductController {
  createProduct = async (req, res, next) => {
    // console.log("👌  req:", req.user);
    // new SuccessResponse({
    //   message: "Create product OK",
    //   metadata: await ProductService.createProduct(req.body.product_type, {
    //     ...req.body,
    //     product_shop: req.user.userId,
    //   }),
    // }).send(res);

    new SuccessResponse({
      message: "Create product OK",
      metadata: await ProductService.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  updateProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Update product OK",
      metadata: await ProductService.updateProduct(
        req.body.product_type,
        req.params.productId,
        {
          ...req.body,
          product_shop: req.user.userId,
        }
      ),
    }).send(res);
  };

  publishProductByShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Publish product OK",
      metadata: await ProductService.publishProductByShop({
        product_id: req.params.id,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  unPublistProductByShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Unpublish product OK",
      metadata: await ProductService.unPublistProductByShop({
        product_id: req.params.id,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  // Query //
  /**
   * @desc Get all drafts for shop
   * @param {Number} limit
   * @param {Number} skip
   * @returns {JSON}
   */
  getAllDraftsForShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Get all drafts for shop OK",
      metadata: await ProductService.findAllDraftsForShop({
        product_shop: req.user.userId,
        limit: req.query.limit,
        skip: req.query.skip,
      }),
    }).send(res);
  };

  getAllPublishForShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Get all publish for shop OK",
      metadata: await ProductService.findAllPublishForShop({
        product_shop: req.user.userId,
        limit: req.query.limit,
        skip: req.query.skip,
      }),
    }).send(res);
  };

  getListSearchProduct = async (req, res, next) => {
    // console.log("👌  req:", req.params);
    new SuccessResponse({
      message: "Get all publish for user OK",
      metadata: await ProductService.getListSearchProduct({
        keySearch: req.params.keySearch,
      }),
    }).send(res);
  };

  findAllProducts = async (req, res, next) => {
    new SuccessResponse({
      message: "Get all products OK",
      metadata: await ProductService.findAllProducts(req.query),
    }).send(res);
  };

  findProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Get product OK",
      metadata: await ProductService.findProduct({
        product_id: req.params.product_id,
      }),
    }).send(res);
  };
  // End query //
}

module.exports = new ProductController();
