const { validationResult } = require("express-validator");
const HTTP_STATUS = require("../constants/statusCodes");
const ProductModel = require("../model/Product");
const { success, failure } = require("../util/common");

class Product {
  async getAll(req, res) {
      try {
        const validation = validationResult(req).array();
        if (validation.length > 0) {
            return res
                .status(HTTP_STATUS.OK)
                .send(failure("Invalid property input", validation));
        }
        
        let { page, limit, title, description, price, priceCriteria, rating, ratingCriteria, stock, stockCriteria, brand, category, search, sortParam, sortOrder } = req.query;

        const defaultPage = 1;
        const defaultLimit = 20;
        
        let skipValue = (defaultPage-1) * defaultLimit;
        let pageNumber = defaultPage;
        if(page>0 && limit>0){
          skipValue = (page-1) * limit;
          pageNumber = page;
        } else {
          if(page>0) { // only page given
            skipValue = (page-1) * defaultLimit;
            pageNumber = page;
          } else if(limit>0) { // only limit given
            skipValue = (defaultPage-1) * limit;
          }
        }


        // console.log(sortParam);
        let sortingOrder = -1; // default descending by creation time i.e. recent uploaded products
        if(sortOrder === "asc"){
          sortingOrder = 1;
        }
        let sortObject = {};
        if(sortParam) {
          sortObject = {[`${sortParam}`] : sortingOrder};
        } else if(!sortParam) {
          sortObject = {"createdAt" : sortingOrder};
        }
        // console.log(sortObject);

        let queryObject = {}; // filter object

        if(brand) {
          queryObject.brand = {$regex: brand, $options: "i"};
        }

        if(category) {
          queryObject.category = category.toLowerCase();
        }

        if(price && priceCriteria) {
          queryObject.price = {[`$${priceCriteria}`] : price};
        } else if(priceCriteria && !price) {
          return res.status(HTTP_STATUS.BAD_REQUEST).send(failure("Invalid request for filtering price"));
        } else if(price && !priceCriteria) {
          queryObject.price = {$eq : price};
        }

        if(rating && ratingCriteria) {
          queryObject.rating = {[`$${ratingCriteria}`] : rating};
        } else if(ratingCriteria && !rating) {
          return res.status(HTTP_STATUS.BAD_REQUEST).send(failure("Invalid request for filter by rating"));
        } else if(rating && !ratingCriteria) {
          queryObject.rating = {$eq : rating};
        }

        if(stock && stockCriteria) {
          queryObject.stock = {[`$${stockCriteria}`] : stock};
        } else if(stockCriteria && !stock) {
          return res.status(HTTP_STATUS.BAD_REQUEST).send(failure("Invalid request for filter by stock"));
        } else if(stock && !stockCriteria) {
          queryObject.stock = {$eq : stock};
        }
        
        console.log(queryObject);

        if(!search) {
          search = "";
        }

        const pageProducts = await ProductModel.find(queryObject)
                            .or ([
                                {title : {$regex: search, $options: "i"}}, 
                                {description : {$regex: search, $options: "i"}}
                            ])
                            .sort(sortObject)
                            .skip(skipValue) 
                            .limit(limit || defaultLimit);
        if (pageProducts.length === 0) {
            return res.status(HTTP_STATUS.NOT_FOUND).send(failure("No products to show"));
        }
        // const totalProducts = (await ProductModel.find({})).length;
        return res
            .status(HTTP_STATUS.OK)
            .send(
                success("Successfully got the products", {
                  // total: totalProducts,
                  pageNo: Number(pageNumber),
                  limit: Number(limit),
                  countPerPage: pageProducts.length,
                  products: pageProducts,
                })
            );
      } catch (error) {
          console.log(error);
          return res
              .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
              .send(failure("Internal server error"));
      }
  }

  async addProduct(req, res) {
      try {
          const validation = validationResult(req).array();
          if (validation.length > 0) {
              return res
                  .status(HTTP_STATUS.OK)
                  .send(failure("Invalid properties", validation));
          }
          const { title, description, price, stock, brand, category, thumbnail } = req.body;

          const existingProduct = await ProductModel.findOne({ title: title });

          if (existingProduct) {
              return res
                  .status(HTTP_STATUS.NOT_FOUND)
                  .send(failure("Product with same title already exists"));
          }

          const newProduct = await ProductModel.create({
              title: title,
              description: description,
              price: price,
              stock: stock,
              brand: brand,
              category: category,
              thumbnail: thumbnail,
          });
          console.log(newProduct);
          if (newProduct) {
              return res
                  .status(HTTP_STATUS.OK)
                  .send(success("Successfully added the product", newProduct));
          } else{
            // console.log();
            return res.status(304).send( failure("Product could not be added"));
          }
      } catch (error) {
          console.log(error);
          return res
              .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
              .send(failure("Internal server error"));
      }
  }


}

module.exports = new Product();