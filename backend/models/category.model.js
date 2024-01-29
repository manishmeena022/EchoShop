import mongoose,{Schema, model} from "mongoose";

const categorySchema = new Schema(
    {
        name: {
            type : String,
            unique : true,
            trim : true,
            required : [true, "Name is required"],
            minLength : [2, "Too Short"],
            maxLength : [32, "Too long"],
        },
        slug : {
            type :  String,
            unique : true,
            lowercase : true,
            index : true,
        },
    },{
        timestamps: true,
    }
)

export const Category = mongoose.model("Category", categorySchema)