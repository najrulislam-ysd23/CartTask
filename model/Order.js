const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required:true,
    },
    books: 
    [
        {
            _id:false,
            bookISBN: {
                type: String,
                ref: "Book",
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
            book: {
                type: mongoose.Types.ObjectId,
                ref: "Book",
                required:true,
            },
        }
    ],

    // For array of objects
    // Orders: {
    //     type: [
    //         {
    //             orderId: Number,
    //             totalPrice: Number, 
    //         }
    //     ]
    // },
},
{timestamps: true},
);

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;