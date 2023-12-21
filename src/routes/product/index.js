const express = require("express");
const productControler = require("../../controllers/product.controller");
const asyncHandler = require("../../helpers/asyncHandler");
const { authenticationV2 } = require("../../auth/authUtils");
const router = express.Router();

router.get(
  "/search/:keySearch",
  asyncHandler(productControler.getListSearchProduct)
);
router.get("", asyncHandler(productControler.findAllProducts));
router.get("/:product_id", asyncHandler(productControler.findProduct));

// authentication
router.use(authenticationV2);
///////////////////////
router.post("", asyncHandler(productControler.createProduct));
router.patch("/:productId", asyncHandler(productControler.updateProduct));
router.post(
  "/publish/:id",
  asyncHandler(productControler.publishProductByShop)
);
router.post(
  "/unpublish/:id",
  asyncHandler(productControler.unPublistProductByShop)
);

// Query //
router.get("/drafts/all", asyncHandler(productControler.getAllDraftsForShop));
router.get(
  "/published/all",
  asyncHandler(productControler.getAllPublishForShop)
);

module.exports = router;
