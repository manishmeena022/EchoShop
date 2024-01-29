import slugify from "slugify";
import asyncHandler from "../middleware/asyncHandler.js";
import { Category } from "../models/category.model.js";

//create Category
const createCategory = asyncHandler(async(req, res) => {
    const { name } = req.body;
    if(!name){
        res.status(400);
        throw new Error("Please fill in category name");
    }

    const categoryExists = await Category.findOne({ name })
    if(categoryExists){
        res.status(400);
        throw new Error("Category name already Exists.");
    }

    const category = await Category.create({ 
        name, 
        slug: slugify(name)
    })
    if(category){
        res.status(201).json(category);
    }
});

//Get Categories
const getCategories = asyncHandler(async(req, res) => {
    const categories = await Category.find().sort("-createdAt");
    res.status(200).json(categories);
})

//Delete Category
const deleteCategory = asyncHandler(async(req, res) => {
    const slug = req.params.slug.toLowerCase()
    const category = await Category.findOneAndDelete({ slug })
    if(!category){
        res.status(404);
        throw new Error("Category not found")
    }
    res.status(200).json({ message : "Category deleted!"});
})


export { createCategory, getCategories, deleteCategory}