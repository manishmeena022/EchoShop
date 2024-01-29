import mongoose,{Schema} from "mongoose";

const brandSchema = new Schema(
    {   
        name: {
            type : String,
            unique: true,
            trim : true,
            required : [true, "Name is Required"],
            minLength : [2, "Too short"],
            maxLength : [32, "Too long"],
        }, 
        slug: {
            type : String,
            unique: true,
            lowercase : true,
            index: true,
        },
        category : {
            type:  String,
            required : true,
        },
    },{
        timestamps : true,
    }
)

export const Brand = mongoose.model("Brand", brandSchema)