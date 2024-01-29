import express,{Router} from "express";
import { adminOnly, protect } from "../middleware/authMiddleware.js";
import { createCategory, deleteCategory, getCategories } from "../controllers/category.controller.js";

const categoryRoute = Router();

categoryRoute.post("/createCategory", protect, adminOnly, createCategory);
categoryRoute.get("/getCategories", protect, adminOnly, getCategories);
categoryRoute.delete("/:slug", protect, adminOnly, deleteCategory);

export default categoryRoute