import asyncHandler from "../middleware/asyncHandler.js";
import { Coupon } from "../models/coupon.model.js";

//createCoupon
const createCoupon = asyncHandler(async(req, res) => {
    const { name, discount, expiresAt} = req.body;

    if(!name ||  !discount || !expiresAt) {
        res.status(400);
        throw new Error("Please fill in all fields");
    }

    const coupon = await Coupon.create({
        name, 
        discount,
        expiresAt,
    });
    if(coupon){
        res.status(201).json(coupon);
    }else{
        res.status(400);
        throw new Error("Something went wrong!!! Please Try Again.");
    }
})

const getCoupons = asyncHandler(async (req, res) => {
    const coupons = await Coupon.find().sort("-createdAt");
    res.status(200).json(coupons);
});

const getCoupon = asyncHandler(async (req, res) => {
    
    const coupon = await Coupon.findOne({
        name: req.params.couponName,
        expiresAt: { $gt: Date.now() },
    });

    if (!coupon) {
        // If the coupon is not found or has expired, send a 404 response
        return res.status(404);
        throw new Error("Coupon not found or has expired");
    }
    // If the coupon is found and valid, send a 200 response with the coupon data
    res.status(200).json(coupon);
});

const deleteCoupon = asyncHandler(async (req, res) => {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);

    if (!coupon) {
        // If the coupon is not found, send a 404 response
        return res.status(404);
        throw new Error("Coupon not found");
    }

    // If the coupon is found and deleted successfully, send a 200 response
    res.status(200).json({ message: 'Coupon deleted successfully' });
});


export { createCoupon, getCoupons, getCoupon, deleteCoupon}