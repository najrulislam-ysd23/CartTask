const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Types.ObjectId,
            ref: "User",
            required:true,
        },
        books: {
            type: [
                {
                    _id:false,
                    book: {
                        type: mongoose.Types.ObjectId,
                        ref: "Book",
                        required: true,
                    },
                    quantity: Number,
                },
            ],
        },
        total: { type:Number, required: true },
        checkoutStatus: { type:Number, required: true },
    },
    { timestamps: true }
);

const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;