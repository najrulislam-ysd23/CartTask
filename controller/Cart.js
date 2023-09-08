const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
const CartModel = require("../model/Cart");
const BookModel = require("../model/Book");
const { success, failure } = require("../util/common");
const HTTP_STATUS = require("../constants/statusCodes");


class Cart {
    
    async addToCart(req, res) {
      try {
        const validation = validationResult(req).array();
        console.log(validation);
        if(validation.length > 0) {
        //   return res.status(422).send(failure("Invalid properties", validation));
          return res.status(HTTP_STATUS.OK).send(failure("Failed to add the order", validation));
        }
        else {
            // const {name, email, role, personal_info{age, address}} = req.body;
            // let cartBookQuantity = 0;
            const { user, book, quantity } = req.body;
            // const bookRequested = await BookModel.find({_id: book});
            let cart = await CartModel.find({user: user});
            console.log(cart);
            if(!cart){            
                // If no cart exists, create a new one
                cart = new CartModel({ user: user, books: [], checkoutStatus: false, total: 0 });
                console.log(cart);
            }
            console.log(cart.books);
            const cartItem = cart.books.find((element) => element.book === book);
            console.log(cartItem);

            if (cartItem) {
                // If the product is already in the cart, update the quantity
                cartItem.quantity += quantity;
            } else {
                // If the product is not in the cart, add it
                cart.books.push({ book, quantity });
            }
          
            
            // if(bookRequested.stock)
            // const cart = await OrderModel.findOne({ _id: id })
            //             .populate("user", "name")
            //             .populate("books.book");
            // console.log(order);
            
            // const orderedBooks = order.books;
            // console.log(orderedBooks);
            // var priceArr = [];
            // orderedBooks.forEach(function (data, index, jsonData) {
            //     priceArr.push(data.book.price*data.quantity);
            // });
            // const totalPrice = priceArr.reduce(
            //     (total, current) => total+current, 0   
            // );
            // console.log(totalPrice);
            // const dummyTotal ={"Total price": totalPrice};
            // console.log(dummyTotal);
            
            // const updatedOrder = {...orderedBooks, ...dummyTotal};
            // const updatedOrder = {...order._doc, ...dummyTotal};
            await cart
                .save()
                .then((data) => {
                    return res.status(HTTP_STATUS.CREATED).send(success("Successfully added to cart", data));
                })
                .catch((err) => {
                    console.log(err);
                    return res.status(HTTP_STATUS.UNPROCESSABLE_ENTITY).send(failure("Failed to add to cart"));
                });
        }
      } catch (error) {
            console.log(error);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(failure("Internal server error from add-to-cart"));
      }
    }



    
  }
  
  module.exports = new Cart();



