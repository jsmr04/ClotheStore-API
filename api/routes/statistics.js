const express = require("express");
const Category = require("../models/Category");
const Product = require("../models/Product");
const Order = require("../models/Order");

var moment = require('moment');  

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

router.get("/chart/orders-overview", async (req, res) => {
  const completed = await Order.find({ status: "COMPLETED" }).count().exec();
  const pending = await Order.find({ status: "PENDING" }).count().exec();
  const ready = await Order.find({ status: "READY" }).count().exec();
  const shipped = await Order.find({ status: "SHIPPED" }).count().exec();

  const result = [
    {x: "Pending", y: pending},
    {x: "Ready", y: ready},
    {x: "Completed", y: completed},
    {x: "Shipped", y: shipped},
  ]

  res.status(200).json(result);
});

router.get("/chart/sales-overview", async (req, res) => {
 
  let orders;

  const newOrders = await Order.aggregate(
    [
      {
        $group: {
          _id: { $dateToString: { format: "%m", date: "$createdAt" } },
          total: { $sum: "$total" }
        }
      }
    ],function (err, result) {
      if (err) {
          console.log(err);
          return;
      }
      orders = result;
  });

  let ordersDefault = [
    { x: 'Jan', y: 0 },
    { x: 'Feb', y: 0 },
    { x: 'Mar', y: 0 },
    { x: 'Apr', y: 0 },
    { x: 'May', y: 0 },
    { x: 'Jun', y: 0 },
    { x: 'Jul', y: 0 },
    { x: 'Aug', y: 0 },
    { x: 'Sep', y: 0 },
    { x: 'Oct', y: 0 },
    { x: 'Nov', y: 0 },
    { x: 'Dez', y: 0 },
  ]

  let result = [];

  ordersDefault.forEach((order) => {
    orders.forEach((x) => {
      if(order.x === moment(x._id).format("MMM")){
        let tmp = {
          x: moment(x._id).format("MMM"),
          y: x.total
        }
        result.push(tmp)
      } else {
        result.push(order)
      }
    })
  })

  res.status(200).json(result);
});


module.exports = router;
