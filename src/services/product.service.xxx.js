const { BadRequestError } = require("../core/error.response");
const {
  product,
  clothing,
  electronic,
  furniture,
} = require("../models/product.model");
const {
  findAllDraftsForShop,
  publishProductByShop,
  queryProduct,
  unPublistProductByShop,
  searchProductByUser,
  findAllProducts,
  findProduct,
  updateProductById,
} = require("../models/repositories/product.repo");
const { removeUndefinedObject, updateNestedObjectParser } = require("../utils");

class ProductFactory {
  static productRegisttry = {};

  static registerProductType(type, classRef) {
    ProductFactory.productRegisttry[type] = classRef;
  }

  static async createProduct(type, payload) {
    const productClass = ProductFactory.productRegisttry[type];

    if (!productClass) throw new BadRequestError(`Type ${type} not found`);

    return new productClass(payload).createProduct();
  }

  // put //
  static async publishProductByShop({ product_id, product_shop }) {
    return await publishProductByShop({ product_id, product_shop });
  }
  static async unPublistProductByShop({ product_id, product_shop }) {
    return await unPublistProductByShop({ product_id, product_shop });
  }
  static async updateProduct(type, productId, payload) {
    const productClass = ProductFactory.productRegisttry[type];

    if (!productClass) throw new BadRequestError(`Type ${type} not found`);

    return new productClass(payload).updateProduct(productId, payload);
  }
  // end put //

  // query
  static async findAllDraftsForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isDraft: true };
    return await queryProduct({ query, limit, skip });
  }

  static async findAllPublishForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isPublish: true };
    return await queryProduct({ query, limit, skip });
  }

  static async getListSearchProduct({ keySearch }) {
    return await searchProductByUser({ keySearch });
  }

  static async findAllProducts({
    limit = 50,
    sort = "ctime",
    page = 1,
    filter = {
      isPublish: true,
    },
  }) {
    // console.log("👌  limit:", limit);
    return await findAllProducts({
      limit,
      sort,
      page,
      filter,
      select: ["product_name", "product_thumb", "product_price"],
    });
  }

  static async findProduct({ product_id }) {
    return await findProduct({ product_id, unSelect: ["__v"] });
  }
}

class Product {
  constructor({
    product_name,
    product_thumb,
    product_description,
    product_price,
    product_type,
    product_shop,
    product_attributes,
    product_quantity,
  }) {
    this.product_name = product_name;
    this.product_thumb = product_thumb;
    this.product_description = product_description;
    this.product_price = product_price;
    this.product_type = product_type;
    this.product_shop = product_shop;
    this.product_attributes = product_attributes;
    this.product_quantity = product_quantity;
  }

  async createProduct(product_id) {
    return await product.create({
      ...this,
      _id: product_id,
    });
  }

  async updateProduct(productId, bodyUpdate) {
    return await updateProductById({
      bodyUpdate,
      productId,
      model: product,
    });
  }
}

// define sub-class for different product types
class Clothing extends Product {
  async createProduct() {
    const newClothing = await clothing.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });

    if (!newClothing) throw new BadRequestError("create new clothing error");

    const newProduct = await super.createProduct();
    if (!newProduct) throw new BadRequestError("create new product error");

    return newProduct;
  }

  async updateProduct(productId) {
    const objectParams = removeUndefinedObject(this);
    // console.log("👌  objectParams:", objectParams);
    if (objectParams.product_attributes) {
      await updateProductById({
        bodyUpdate: updateNestedObjectParser(objectParams.product_attributes),
        productId,
        model: clothing,
      });
    }

    const updateProduct = await super.updateProduct(
      productId,
      updateNestedObjectParser(objectParams)
    );

    return updateProduct;
  }
}

class Electronics extends Product {
  async createProduct() {
    const newElectronic = await electronic.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });

    if (!newElectronic)
      throw new BadRequestError("create new electronic error");

    const newProduct = await super.createProduct();
    if (!newProduct) throw new BadRequestError("create new product error");

    return newProduct;
  }
}

class Furniture extends Product {
  async createProduct() {
    const newFurniture = await furniture.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });

    if (!newFurniture) throw new BadRequestError("create new furniture error");

    const newProduct = await super.createProduct();
    if (!newProduct) throw new BadRequestError("create new product error");

    return newProduct;
  }
}

ProductFactory.registerProductType("Clothing", Clothing);
ProductFactory.registerProductType("Electronics", Electronics);
ProductFactory.registerProductType("Furniture", Furniture);

module.exports = ProductFactory;
