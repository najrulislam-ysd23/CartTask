const { validationResult } = require("express-validator");
const UserModel = require("../model/User");
const { success, failure } = require("../util/common");
const HTTP_STATUS = require("../constants/statusCodes");


class User {
    async getAll(req, res) {
      try {
        const users = await UserModel.find({});
        console.log(users);
        if(users.length>0){
            return res.status(HTTP_STATUS.OK).send(success("Successfully got all the users", { users, total: users.length }));
        } else {
            return res.status(HTTP_STATUS.OK).send(success("No users were found"));
        }
      } catch (error) {
            console.log(error);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(failure("Internal server error from getAll"));
      }
    }
  
    async getById(req, res) {
      try {
        const { id } = req.params;
        const user = await UserModel.findById({ _id: id });
        if (user) {
            return res.status(HTTP_STATUS.OK).send(success("Successfully received the user", user));
        } else {
            return res.status(HTTP_STATUS.OK).send(failure("Failed to received the user"));
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
            const { name, email, role, age, address } = req.body;
            const user = new UserModel({ name, email, role, age, address});
            const existingUser = await UserModel.findOne({ email: email });
            console.log(existingUser);
            if (existingUser) {
              return res.status(HTTP_STATUS.OK).send(failure("Email already in use"));
            }
            await user
                .save()
                .then((data) => {
                    return res.status(HTTP_STATUS.OK).send(success("Successfully added the user", data));
                })
                .catch((err) => {
                    console.log(err);
                    return res.status(HTTP_STATUS.UNPROCESSABLE_ENTITY).send(failure("Failed to add the user"));
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
        const user = await UserModel.find(req.query);
        if (user) {
            return res.status(HTTP_STATUS.OK).send(success("Successfully received matched users", user));
        } else {
            return res.status(HTTP_STATUS.OK).send(failure("Failed to received the user"));
        }
      } catch (error) {
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(failure("Internal server error from getByQuery"));
      }
    }
    
  }
  
  module.exports = new User();

