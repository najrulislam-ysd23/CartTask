const express = require("express");
const routes = express();
const UserController = require("../controller/User");
const validation = require("../middleware/ExpressValidator");


routes.post('/add', validation.createUser, UserController.addProduct);
routes.get("/all", UserController.getAll);
routes.get('/user/:id', UserController.getById);
routes.get('/filter', UserController.filterByQuery);






// routes.post('/add', ProductValidation.addValidation, ProductController.addProduct);
// routes.delete('/delete/:id', ProductController.deleteById);



// routes.patch('/update', ProductValidation.updateValidation, ProductController.updateById);
// routes.get('/totalstock', ProductController.calculateStock);
// routes.get('/filter', validation.forCategory, ProductController.getByCategory);
// routes.patch('/discount/filter', validation.forCategory, validation.forDiscount, ProductController.updatePriceByDiscount);

// routes.get('/books/orders/generateReceipt', validation.forOrder, ProductController.createReceipt);



module.exports = routes;