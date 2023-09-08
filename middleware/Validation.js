const { failure } = require("../util/common");

class Validation {
    async addValidation(req, res, next) {
        const { title, description, price, stock, category } = req.body;
        const errors = {};
        
        if(!title || title === ""){
            errors.title="Add a title";
        }
        if(!description){
            errors.description="Add a description";
        }
        if (description) {
        if (description.length < 30) {
            errors.description="Description should be atleast 30 characters long";
            // dummy description: 
            // For 2023, Samsung has refined its flagship smartphone. 
            // For 2023, Samsung has refined its flagship smartphone.
        } 
        }
        if(!price){
            errors.price="Price is not provided";
        }
        if (price) {
        if (price <= 50) {
            errors.price="Price should be more than 50";
        } 
        }
        if(!stock || stock <=0){
            errors.stock="Add some stock";
        }
        if(!category || category === ""){
            errors.category="Add a category";
        }
        if (Object.keys(errors).length > 0) {
            console.log(errors);
            // response.status_code = 304;
            return res.send( failure("Properties error", errors));

        } else {
            next();
        }
    }

    async updateValidation(req, res, next) {
        const { title, description, price, stock, category } = req.body;
        const errors = {};
        
        if(title === ""){
            errors.title="Title is blank";
        }
        if (description) {
        if (description.length < 30) {
            errors.description="Description should be atleast 30 characters long";
            // dummy description: 
            // For 2023, Samsung has refined its flagship smartphone. 
            // For 2023, Samsung has refined its flagship smartphone.
        } 
        }
        if (price) {
        if (price <= 50) {
            errors.price="Price should be more than 50";
        } 
        }
        if(stock <=0){
            errors.stock="Add some stock";
        }
        if(category === ""){
            errors.category="Add a category";
        }
        if (Object.keys(errors).length > 0) {
            console.log(errors);
            // response.status_code = 304;
            return res.send( failure("Properties error", errors));
        } else {
            next();
        }
    }


}
module.exports = new Validation();