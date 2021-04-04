const express = require("express");
const { getDate } = require("../../helpers");
const Category = require("../models/Category");
const { isAuthenticated } = require('../auth')

const router = express.Router();

router.get("/", (req, res) => {
  Category.find()
    .exec()
    .then((x) => res.status(200).send(x));
});

router.get("/:id", (req, res) => {
  Category.findOne({ _id: req.params.id })
    .exec()
    .then((x) => res.status(200).send(x));
});

router.post("/", (req, res) => {
  Category.create(req.body).then((x) =>
    res.status(200).send(x)
  );
});

router.put("/:id", (req, res) => {
  console.log(req.params.id)
  console.log(req.body)
  Category.findByIdAndUpdate(req.params.id, req.body)
    .exec()
    .then(() => res.sendStatus(204));
});

router.delete("/:id", (req, res) => {
  Category.findByIdAndRemove(req.params.id)
    .exec()
    .then(() => res.sendStatus(204));
});

module.exports = router;
