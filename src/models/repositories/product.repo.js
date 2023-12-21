"use strict";

const { getSelectData, unGetSelectData } = require("../../utils");
const { product } = require("../product.model");

// const findAllDraftsForShop = async ({ query, limit, skip }) => {
//   return await product
//     .find(query)
//     .populate("product_shop")
//     .sort({ createdAt: -1 })
//     .skip(skip)
//     .limit(limit)
//     .lean()
//     .exec();
// };

// const findAllPublishForShop = async ({ query, limit, skip }) => {};

const publishProductByShop = async ({ product_id, product_shop }) => {
  const foundShop = await product.findOneAndUpdate(
    { _id: product_id, product_shop },
    { isDraft: false, isPublish: true },
    { new: true }
  );

  if (!foundShop) return null;

  return foundShop;
};

const unPublistProductByShop = async ({ product_id, product_shop }) => {
  const foundShop = await product.findOneAndUpdate(
    { _id: product_id, product_shop },
    { isDraft: true, isPublish: false },
    { new: true }
  );

  if (!foundShop) return null;

  return foundShop;
};

const queryProduct = async ({ query, limit, skip }) => {
  return await product
    .find(query)
    .populate("product_shop")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec();
};

const searchProductByUser = async ({ keySearch }) => {
  // console.log("👌  keySearch:", keySearch);
  const regexSearch = new RegExp(keySearch);
  const results = await product
    .find(
      {
        isPublish: true,
        $text: { $search: regexSearch },
      },
      {
        score: { $meta: "textScore" },
      }
    )
    .sort({ score: { $meta: "textScore" } })
    .lean();
  // console.log("👌  results:", results);

  return results;
};

const findAllProducts = async ({ limit, sort, page, filter, select }) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
  const products = await product
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean()
    .exec();

  return products;
};

const findProduct = async ({ product_id, unSelect }) => {
  const foundProduct = await product
    .findById(product_id)
    .select(unGetSelectData(unSelect));

  if (!foundProduct) return null;

  return foundProduct;
};

const updateProductById = async ({
  productId,
  bodyUpdate,
  model,
  isNew = true,
}) => {
  return await model.findByIdAndUpdate(productId, bodyUpdate, {
    new: isNew,
    setDefaultsOnInsert: true,
  });
};

module.exports = {
  publishProductByShop,
  unPublistProductByShop,
  queryProduct,
  searchProductByUser,
  findAllProducts,
  findProduct,
  updateProductById,
};
