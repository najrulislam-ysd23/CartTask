const { validationResult } = require("express-validator");
const BookModel = require("../model/Book");
const { success, failure } = require("../util/common");
const HTTP_STATUS = require("../constants/statusCodes");


class Book {
    async getAll(req, res) {
      try {
        const books = await BookModel.find({});
        console.log(books);
        if(books.length>0){
            return res.status(HTTP_STATUS.OK).send(success("Successfully got all the books", { books, total: books.length }));
        } else {
            return res.status(HTTP_STATUS.OK).send(success("No books were found"));
        }
      } catch (error) {
            console.log(error);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(failure("Internal server error from getAll"));
      }
    }
  
    async getById(req, res) {
      try {
        const { id } = req.params;
        const book = await BookModel.findById({ _id: id });
        if (book) {
            return res.status(HTTP_STATUS.OK).send(success("Successfully received the book", book));
        } else {
            return res.status(HTTP_STATUS.OK).send(failure("Failed to received the book"));
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
          return res.status(HTTP_STATUS.OK).send(failure("Validation error", validation));
        }
        else {
            // const {name, email, role, personal_info{age, address}} = req.body;
            const { bookISBN, bookName, author, genre, price, stock } = req.body;
            const book = new BookModel({ bookISBN, bookName, author, genre, price, stock });
            const existingBook = await BookModel.findOne({ bookISBN: bookISBN })
            if (existingBook) {
              return res.status(HTTP_STATUS.OK).send(success("Book already exists"));
            }
            await book
                .save()
                .then((data) => {
                    return res.status(HTTP_STATUS.OK).send(success("Successfully added the book", data));
                })
                .catch((err) => {
                    console.log(err);
                    return res.status(HTTP_STATUS.UNPROCESSABLE_ENTITY).send(failure("Failed to add the book"));
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
        const book = await BookModel.find(req.query);
        if (book) {
            return res.status(HTTP_STATUS.OK).send(success("Successfully received matched books", book));
        } else {
            return res.status(HTTP_STATUS.OK).send(failure("Failed to received the book"));
        }
      } catch (error) {
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(failure("Internal server error from getByQuery"));
      }
    }
    
  }
  
  module.exports = new Book();