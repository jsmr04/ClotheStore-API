const express = require("express");
const Category = require("../models/Category");
const Product = require("../models/Product");
const Order = require("../models/Order");

const router = express.Router();

router.get("/sales/products", async (req, res) => {
  const sales = await Order.find().exec();
  const productsData = await Product.find().exec();
  //const sales = await Order.find({ status: "COMPLETED" }).exec();
  let products = []

  let salesByProduct = [];
  let summarySalesByProduct = [];

  sales.forEach((s) => {
    s.items.forEach((i) => {

      salesByProduct.push({
        productId: i.product_id,
        productName: i.name,
        subTotal: i.price * i.quantity,
      });

      products.push(i.product_id.toString())
    });
  });

  //Remove duplicates
  products = Array.from(new Set(products))

  //console.log(products)

  products.forEach((x) => {
    const filteredSales = salesByProduct.filter(
      (s) => s.productId.toString() === x
    );
    let sales;

    if (filteredSales.length > 0) {
      sales = filteredSales.reduce((x, s) => x + s.subTotal, 0);
    }

    if (sales) {
        let name = productsData.filter(pd => pd._id.toString() == x)[0].name
        summarySalesByProduct.push({
        _id: x,
        name: name,
        sales,
      });
    }
  });

  res.status(200).json(summarySalesByProduct);
});

router.get("/sales/categories", async (req, res) => {
  const categories = await Category.find().exec();
  const products = await Product.find().exec();
  //const sales = await Order.find().exec();
  const sales = await Order.find({ status: "COMPLETED" }).exec();

  let productsByCategory = [];
  let salesByCategory = [];
  let summarySalesByCategory = [];

  categories.forEach((c) => {
    let temp = products.filter(
      (p) => p.category_id.toString() === c._id.toString()
    );

    temp.forEach((t) => {
      productsByCategory.push({
        category_id: c._id,
        product_id: t._id,
      });
    });
  });

  //console.log(productsByCategory)

  sales.forEach((s) => {
    s.items.forEach((i) => {
      let temp = productsByCategory.filter(
        (p) => p.product_id.toString() === i.product_id.toString()
      );

      if (temp.length != 0) {
        salesByCategory.push({
          categoryId: temp[0].category_id,
          subTotal: i.price * i.quantity,
        });
      }
    });
  });

  console.log(salesByCategory)

  categories.forEach((c) => {
    const filteredSales = salesByCategory.filter(
      (s) => s.categoryId.toString() === c._id.toString()
    );
    let sales;

    if (filteredSales.length > 0) {
      sales = filteredSales.reduce((x, s) => x + s.subTotal, 0);
    }

    if (sales) {
      summarySalesByCategory.push({
        _id: c._id,
        name: c.name,
        sales,
      });
    }
  });

  //summarySalesByCategory
  res.status(200).json(summarySalesByCategory);
});

module.exports = router;
