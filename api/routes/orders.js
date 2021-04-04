const express = require("express");
const Order = require("../models/Order");

const router = express.Router();

router.get("/", (req, res) => {
    Order.find()
    .exec()
    .then((x) => res.status(200).send(x));
});

router.get("/:id", (req, res) => {
    Order.findOne({ _id: req.params.id })
    .exec()
    .then((x) => res.status(200).send(x));
});

router.post("/", (req, res) => {
    Order.create(req.body).then((x) =>
    res.status(200).send(x)
  );
});

router.put("/:id", (req, res) => {
    Order.findByIdAndUpdate(req.params.id, req.body)
    .exec()
    .then(() => res.sendStatus(204));
});

router.delete("/:id", (req, res) => {
    Order.findByIdAndRemove(req.params.id)
    .exec()
    .then(() => res.sendStatus(204));
});

module.exports = router;
