import mongoose ,{Schema} from "mongoose";

const porductSchema = new Schema(
    {
        name: {
            type: String,
            required : [true, "Please add a name"],
            trim: true,
        },
        sku : {
            type: String,
            required: true,
            default: "SKU",
            trim : true,
        },
        category: {
            type: String,
            required: [true, "Please add a category"],
            trim : true,
        },
        brand: {
            type : String,
            required : [true, "Please a brand"],
            trim : true,
        },
        color: {
            type : String,
            required : [true, "Please add a color"],
            default: "As seen",
            trim :  true,
        },
        quantity : {
            type : Number,
            required : [true, "Please add a quantity"],
            trim : true,
        },
        sold : {
            type : Number,
            default: 0,
            trim : true,
        },
        regularPrice: {
            type: Number,
            //required : [true, "Please add a price"],
            trim : true,
        },
        price: {
            type : Number,
            required :  [true, "Please add a price"],
            trim : true,
        },
        description : {
            type : String,
            required : [true, "Please add a description"],
            trim : true,
        },
        image : {
            type : [String],
            required: true,
        },
        ratings : {
            type : [Object],
        },
    },{
        timestamps: true,
    }

)

export const Product = mongoose.model("Product", porductSchema);