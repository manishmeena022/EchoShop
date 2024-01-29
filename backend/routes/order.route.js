import express,{ Router} from "express"
import { createOrder, getOrder, getOrders, payWithStripe, payWithWallet, updateOrderStatus } from "../controllers/order.controller.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";

const orderRoute = Router()

orderRoute.post("/", protect, createOrder);
orderRoute.get("/", protect, getOrders);
orderRoute.get("/:id", protect, getOrder);
orderRoute.patch("/:id", protect, adminOnly, updateOrderStatus);
orderRoute.post("/create-payment-intent", payWithStripe);
orderRoute.post("/payWithWallet", protect, payWithWallet);

export default orderRoute;