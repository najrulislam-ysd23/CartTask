const express = require("express");
const routes = express();
const OrderController = require("../controller/Order");
const validation = require("../middleware/ExpressValidator");


routes.post('/add', validation.createOrder, OrderController.addProduct);
routes.get("/all", OrderController.getAll);
routes.get('/order/:id', OrderController.getById);
routes.get('/filter', OrderController.filterByQuery);






// routes.post('/add', ProductValidation.addValidation, ProductController.addProduct);
// routes.delete('/delete/:id', ProductController.deleteById);



// routes.patch('/update', ProductValidation.updateValidation, ProductController.updateById);
// routes.get('/totalstock', ProductController.calculateStock);
// routes.get('/filter', validation.forCategory, ProductController.getByCategory);
// routes.patch('/discount/filter', validation.forCategory, validation.forDiscount, ProductController.updatePriceByDiscount);

// routes.get('/books/orders/generateReceipt', validation.forOrder, ProductController.createReceipt);



module.exports = routes;