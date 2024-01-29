import express, { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import { 
        getCart, 
        getLoginStatus, 
        getUser, 
        loginUser, 
        logout, 
        registerUser, 
        saveCart, 
        updatePhoto, 
        updateUser,
        changePassword,
        forgotPassword,
        resetPassword,
        addToWishlist,
        getWishlist,
        removeFromWishlist,
        clearCart
    } from "../controllers/user.controller.js";

const userRoute = Router();

userRoute.post("/register", registerUser)
userRoute.post("/login", loginUser)
userRoute.get("/logout", logout)
userRoute.get("/getUser", protect, getUser)
userRoute.get("/getLoginStatus", getLoginStatus)
userRoute.patch("/updateUser",protect, updateUser)
userRoute.patch("/updatePhoto", protect, updatePhoto)
// router.patch("/changepassword", protect, changePassword);
// router.post("/forgotpassword", forgotPassword);
// router.put("/resetpassword/:resetToken", resetPassword);

// wishlist
userRoute.post("/addToWishlist", protect, addToWishlist);
userRoute.get("/getWishlist", protect, getWishlist);
userRoute.put("/wishlist/:productId", protect, removeFromWishlist);


//Cart
userRoute.get("/getCart", protect, getCart);
userRoute.patch("/saveCart", protect, saveCart);
userRoute.patch("/clearCart", protect, clearCart);

export default userRoute;