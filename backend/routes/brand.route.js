import express,{Router} from "express"
import { createBrand, deleteBrand, getBrands } from "../controllers/brand.controller.js"
import { adminOnly, protect } from "../middleware/authMiddleware.js";

const brandRoute = Router()

brandRoute.post("/createBrand",protect, adminOnly, createBrand)
brandRoute.get("/getBrands", protect, adminOnly, getBrands);
brandRoute.delete("/:slug", protect, adminOnly, deleteBrand);

export default brandRoute;