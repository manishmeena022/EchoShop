import mongoose from "mongoose";
import asyncHandler from "../middleware/asyncHandler.js";
//import { fileSizeFormatter } from "../utils/fileUpload.js";
import { Product } from "../models/product.model.js";

//create Product
const createProduct = asyncHandler(async(req, res) => {
    const { name, sku, category, brand, quantity, price, description, image, regularPrice, color} = req.body;

    if( !name ||  !category || !brand ||  !quantity || !price || !description ){
        res.status(400);
        throw new Error("Please fill all fields")
    }

    //Create a Product
    const product = await Product.create({
        name,
        sku, 
        category, 
        brand, 
        quantity, 
        price, 
        description,
        image, 
        regularPrice, 
        color
    })
    res.status(201).json(product);
})

//Get Product
const getProducts = asyncHandler(async(req, res) => {
    const products = await Product.find().sort("-createdAt");
    res.status(200).json(products)
})

//Get Single Product
const getProduct = asyncHandler(async(req, res) => {
    const product = await Product.findById(req.params.id)
    //If product doesn't exist
    if(!product){
        res.send(404)
        throw new Error("Product not found");
    }
    res.status(200).json(product);
})

//Delete Product
const deleteProduct = asyncHandler(async(req, res) => {
    const product = await Product.findById(req.params.id)
    //if product doesn't exist
    if(!product){
        res.send(404)
        throw new Error("Product not found")
    }
    await product.remove();
    res.status(200).json({message : "Product Deleted!"})
})

//Update Product
const updateProduct = asyncHandler(async(req, res) => {
    const { name, category, brand, quantity, price, description, image, regularPrice, color} = req.body;
    const { id } = req.params;

    const product = await Product.findById(id);
    //if product doesn't exist
    if(!product){
        res.status(404);
        throw new Error("Product not found")
    }

    //Updated Product
    const updatedProduct = await Product.findByIdAndUpdate(
        { _id : id},
        {
            name,
            category, 
            brand, 
            quantity, 
            price, 
            description, 
            image, 
            regularPrice, 
            color
        },
        {
            new : true,
            runValidators: true,
        }
    )
    res.status(200).json(updatedProduct);
})

//Review Product
const reviewProduct = asyncHandler(async(req, res) => {
    const { star, review, reviewDate } = req.body;
    const { id } = req.params;
    
    //validation
    if(star < 1 || !review ){
        res.status(404);
        throw new Error("Please add a star and review");
    }

    const product = await Product.findById(id)

    // If Product doesn't exist
    if(!product){
        res.status(404)
        throw new Error("Product not found");
    }
    
    //Update Ratig
    product.ratings.push(
        {
            star,
            review,
            reviewDate,
            name : req.user.name,
            userID : req.user._id,
        }
    )
    product.save()
    res.status(200).json({ message: "Product review added!"})
})

//Delete Review
const deleteReview = asyncHandler(async(req, res) => {
    const { userID }  = req.body;
    
    const product = await Product.findById(req.params.id);
    //If product doesn't exist
    if(!product){
        res.send(404);
        throw new Error("Product not found");
    }

    const newRatings = product.ratings.filter((rating) => {
        return rating.userID.toString() !== userID.toString()
    })
    product.ratings = newRatings;
    product.save()
    res.status(200).json({ message: "Product review Deleted" })
})

//Update Review
const updateReview = asyncHandler(async(req, res) => {
    const { star, review, reviewDate, userID} = req.body;
    const { id } = req.params;

    //validation 
    if(star < 1 || !review){
        res.status(400);
        throw new Error("Please add a star and review"); 
    }

    const product = await Product.findById(id);
    
    // if product doesnt exist
    if(!product){
        res.status(404);
        throw new Error("Product not found");
    }

    //Match user to review
    if(req.user._id.toString() !== userID){
        res.status(401)
        throw new Error("User not authorized")
    }

    //Update product review
    const updatedReview = await Product.findOneAndUpdate(
        {
            _id : product._id,
            "ratings.userID": mongoose.Types.ObjectId(userID)
        },
        {
            $set: {
                "ratings.$.star": Number(star),
                "ratings.$.review": review,
                "ratings.$.reviewDate": reviewDate,
            }
        }
    );

    if(updatedReview){
        res.status(200).json({ message: "Product review Updated!" })
    }
    res.status(400).json({ message: "Product review NOT Updated!" })
})


export { 
        createProduct, 
        getProducts, 
        getProduct, 
        deleteProduct, 
        updateProduct, 
        reviewProduct, 
        deleteReview, 
        updateReview
    }