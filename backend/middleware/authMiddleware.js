import { User } from "../models/user.model.js";
import asyncHandler from "./asyncHandler.js";
import jwt from "jsonwebtoken";

const protect = asyncHandler(async(req, res, next) => {
    try{
        const token = req.cookies.token;
        if(!token){
            res.status(401);
            throw new Error("Not authorized, please login");
        }

        //verify Token
        const verified = jwt.verify(token, process.env.JWT_SECRET)
        //get user id from token
        const user = await User.findById(verified.id).select("-password")

        if(!user){
            res.status(401);
            throw new Error("User not found");
        }
        req.user = user;
        next()

    }catch(error){
        res.status(401);
        throw new Error("Not authorized, please login");
    }
})

//Admin only
const adminOnly = (req, res, next) => {
    if(req.user && req.user.role === "admin"){
        next()
    }else{
        res.status(401)
        throw new Error("Not authorized as Admin")
    }
}

export { protect, adminOnly };