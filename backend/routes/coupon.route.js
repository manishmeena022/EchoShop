import express, {Router} from "express";
import { createCoupon, deleteCoupon, getCoupon, getCoupons } from "../controllers/coupon.controller.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";

const couponRoute = Router()

couponRoute.post("/createCoupon", protect , adminOnly , createCoupon);
couponRoute.get("/getCoupons", protect, adminOnly, getCoupons);
couponRoute.get("/:couponName", protect, getCoupon);
couponRoute.delete("/:id", protect, adminOnly, deleteCoupon);

export default couponRoute;