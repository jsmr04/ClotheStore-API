const express = require("express");
const Product = require("../models/Product");

const router = express.Router();

router.get("/", (req, res) => {
  Product.find()
    .exec()
    .then((x) => res.status(200).send(x));
});

router.get("/:id", (req, res) => {
  Product.findOne({ _id: req.params.id })
    .exec()
    .then((x) => res.status(200).send(x));
});

router.post("/", (req, res) => {
  Product.create(req.body).then((x) =>
    res.status(200).send(x)
  );
});

router.put("/:id", (req, res) => {
  Product.findByIdAndUpdate(req.params.id, req.body)
    .exec()
    .then(() => res.sendStatus(204));
});

router.delete("/:id", (req, res) => {
  Product.findByIdAndRemove(req.params.id)
    .exec()
    .then(() => res.sendStatus(204));
});

module.exports = router;
