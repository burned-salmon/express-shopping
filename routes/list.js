const express = require("express");
const router = new express.Router();
const ExpressError = require("../expressError");
const list = require("../fakeDb");

router.get("/", function (req, res) {
  res.send(list);
})

router.post("/", function (req, res, next) {
  try {
    if (!req.body.name) throw new ExpressError("Name is required", 400);
    if (!req.body.price) throw new ExpressError("Price is required", 400);
    const newListItem = { name: req.body.name, price: req.body.price }
    list.push(newListItem);
    return res.status(201).json({ added: newListItem });
  } catch (e) {
    return next(e);
  }
})

router.get("/:name", function (req, res) {
  const foundListItem = list.find(item => item.name === req.params.name);
  if (foundListItem === undefined) {
    throw new ExpressError("Item not found", 404);
  }
  res.json(foundListItem);
})

router.patch("/:name", function (req, res) {
  const foundListItem = list.find(item => item.name === req.params.name);
  if (foundListItem === undefined) {
    throw new ExpressError("Item not found", 404);
  }
  foundListItem.name = req.body.name;
  res.json({ updated: foundListItem });
})

router.delete("/:name", function (req, res) {
  const foundListItem = list.findIndex(item => item.name === req.params.name);
  if (foundListItem === -1) {
    throw new ExpressError("Item not found", 404);
  }
  list.splice(foundListItem, 1);
  res.json({ message: "Deleted" });
})

module.exports = router;