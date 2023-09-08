const { validationResult } = require("express-validator");
const OrderModel = require("../model/Order");
const { success, failure } = require("../util/common");
const HTTP_STATUS = require("../constants/statusCodes");


class Order {
    async getAll(req, res) {
      try {
        const orders = await OrderModel.find({})
            .populate("user", "name")
            // .populate("books.bookISBN")
            .populate("books.book");
        console.log(orders);
        if(orders.length>0){
            return res.status(HTTP_STATUS.OK).send(success("Successfully got all the orders", { orders, total: orders.length }));
        } else {
            return res.status(HTTP_STATUS.OK).send(success("No orders were found"));
        }
      } catch (error) {
            console.log(error);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(failure("Internal server error from getAll"));
      }
    }
  
    async getById(req, res) {
      try {
        const { id } = req.params;
        const order = await OrderModel.findOne({ _id: id })
            .populate("user", "name")
            .populate("books.book");
        console.log(order);
        
        const orderedBooks = order.books;
        console.log(orderedBooks);
        var priceArr = [];
        orderedBooks.forEach(function (data, index, jsonData) {
            priceArr.push(data.book.price*data.quantity);
        });
        const totalPrice = priceArr.reduce(
          (total, current) => total+current, 0   
        );
        console.log(totalPrice);
        const dummyTotal ={"Total price": totalPrice};
        console.log(dummyTotal);
        
        // const updatedOrder = {...orderedBooks, ...dummyTotal};
        const updatedOrder = {...order._doc, ...dummyTotal};
        console.log(updatedOrder);
        if (updatedOrder) {
            return res.status(HTTP_STATUS.OK).send(success("Successfully received the order", updatedOrder));
        } else {
            return res.status(HTTP_STATUS.OK).send(failure("Failed to received the order"));
        }
      } catch (error) {
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(failure("Internal server error from getById"));
      }
    }

    // using express-validator
    async addProduct(req, res) {
      try {
        const validation = validationResult(req).array();
        console.log(validation);
        if(validation.length > 0) {
        //   return res.status(422).send(failure("Invalid properties", validation));
          return res.status(HTTP_STATUS.OK).send(failure("Failed to add the order", validation));
        }
        else {
            // const {name, email, role, personal_info{age, address}} = req.body;
            const { user, orders } = req.body;
            const order = new OrderModel({ user, orders });
            await order
                .save()
                .then((data) => {
                    return res.status(HTTP_STATUS.OK).send(success("Successfully added the order", data));
                })
                .catch((err) => {
                    console.log(err);
                    return res.status(HTTP_STATUS.UNPROCESSABLE_ENTITY).send(failure("Failed to add the order"));
                });
        }
      } catch (error) {
            console.log(error);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(failure("Internal server error from add"));
      }
    }


    async filterByQuery(req, res) {
      try {
        console.log("exec..");
        const { email } = req.query;
        const order = await OrderModel.find(req.query);
        if (order) {
            return res.status(HTTP_STATUS.OK).send(success("Successfully received matched orders", order));
        } else {order
            return res.status(HTTP_STATUS.OK).send(failure("Failed to received the order"));
        }
      } catch (error) {
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(failure("Internal server error from getByQuery"));
      }
    }


    
  }
  
  module.exports = new Order();

