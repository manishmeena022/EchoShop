import mongoose,{ Schema } from "mongoose";

const orderSchema = new Schema(
    {
        user : {
            type : Schema.Types.ObjectId,
            ref : "User",
            required : true,
        },
        orderDate : {
            type : String,
            required : [true, "Please add an order date"],
            trim : true,
        },
        orderTime : {
            type : String,
            required : [true, "Please add an order date"],
            trim : true,
        },
        orderAmount : {
            type : Number,
            required : [true, "Please add an order amount"],
            trim : true,
        },
        orderStatus : {
            type : String,
            required : [true, "Please add an order status"],
            trim : true,
        },
        paymentMethod : {
            type : String,
            trim : true,
        },
        cartItems : {
            type : [Object],
            required : [true],
        },
        shippingAddress : {
            type : Object,
            required : true,
        },
        coupon : {
            type : Object,
            required : true,
            default : {
                name : "nil",
            },
        },
    },{
        timestamps : true,
    }
)

export const Order = mongoose.model("Order", orderSchema);