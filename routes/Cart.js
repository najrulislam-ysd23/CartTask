const express = require("express");
const routes = express();
const CartController = require("../controller/Cart");
const validation = require("../middleware/ExpressValidator");


routes.post('/add-to-cart', validation.addToCart, CartController.addToCart);
// routes.get("/all", CartController.getAll);


module.exports = routes;