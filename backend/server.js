import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import userRoute from "./routes/user.route.js";
import errorHandler from "./middleware/errorMiddleware.js";
import productRoute from "./routes/product.route.js";
import categoryRoute from "./routes/category.route.js";
import brandRoute from "./routes/brand.route.js";
import couponRoute from "./routes/coupon.route.js";
import orderRoute from "./routes/order.route.js";
import transactionRoute from "./routes/transaction.route.js";

dotenv.config();
const app = express();

//Middlewares
app.use(cookieParser());
app.use(express.urlencoded({
    extended: false
}));

app.use(cors({
    origin: ["http://localhost:3000", ""],
    credentials: true,
}));

app.use("/api/transaction", transactionRoute);
app.use(express.json())

//routes 
app.use("/api/users", userRoute);
app.use("/api/products", productRoute);
app.use("/api/order", orderRoute);
app.use("/api/category", categoryRoute);
app.use("/api/brand", brandRoute);
app.use("/api/coupon", couponRoute);

app.get("/", (req, res) => {
    res.send("Homepage...")
})
  
// Paypay Payment
app.post("/my-server/create-paypal-order", async (req, res) => {
    try {
      const order = await createOrder(req.body);
      res.json(order);
    } catch (err) {
      res.status(500).send(err.message);
    }
});
  
app.post("/my-server/capture-paypal-order", async (req, res) => {
    const { orderID } = req.body;
    try {
      const captureData = await capturePayment(orderID);
      res.json(captureData);
    } catch (err) {
      res.status(500).send(err.message);
    }
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
connectDB();
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))