import mongoose,{Schema} from "mongoose";

const couponSchema = new Schema(
    {
        name : {
            type : String,
            required : true,
            unique : true,
            uppercase : true,
            required : [true, "Please add coupon name"],
            minlength : [6,"Coupon must be up to 6 characters"],
            maxlength : [12,"Coupon must not be more than 12 characters"],

        },
        discount : {
            type : String,
            required : true,
        },
        expiresAt : {
            type : Date,
            required : true,
        },
    },{
        timestamps : true,
    }
)

export const Coupon = mongoose.model("Coupon", couponSchema)