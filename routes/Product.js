const express = require("express");
const routes = express();
const ProductController = require("../controller/Product");
const ProductValidation = require("../middleware/Validation");
const validation = require("../middleware/ExpressValidator");

routes.get("/", validation.queryValidation, ProductController.getAll);
// routes.post('/add', ProductValidation.addValidation, ProductController.addProduct);
// routes.get('/product/:id', ProductController.getById);
// routes.delete('/delete/:id', ProductController.deleteById);


routes.post('/add', validation.createProduct, ProductController.addProduct);
// routes.patch('/update', ProductValidation.updateValidation, ProductController.updateById);
// routes.get('/totalstock', ProductController.calculateStock);
// routes.get('/filter', validation.forCategory, ProductController.getByCategory);
// routes.patch('/discount/filter', validation.forCategory, validation.forDiscount, ProductController.updatePriceByDiscount);

// routes.get('/books/orders/generateReceipt', validation.forOrder, ProductController.createReceipt);



module.exports = routes;