import express,{Router} from  "express";
import { createProduct, deleteProduct, deleteReview, getProduct, getProducts, reviewProduct, updateProduct, updateReview } from "../controllers/product.controller.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";

const productRoute = Router()

productRoute.post("/", protect, adminOnly, createProduct);
productRoute.get("/", getProducts)
productRoute.get("/:id", getProduct)
productRoute.delete("/:id", protect, adminOnly, deleteProduct)
productRoute.patch("/:id", protect, adminOnly, updateProduct)
productRoute.patch("/review/:id", protect, reviewProduct)
productRoute.patch("/deleteReview/:id", protect, deleteReview)
productRoute.patch("/updateReview/:id", protect, updateReview)

export default  productRoute;