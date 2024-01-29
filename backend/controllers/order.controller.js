import asyncHandler from "../middleware/asyncHandler.js";
import { Order } from "../models/order.model.js";
import { calculateTotalPrice } from "../utils/index.js";
import { Product } from "../models/product.model.js";
import stripe from "stripe";
import axios from "axios";
import { User } from "../models/user.model.js";
import { Transaction } from "../models/transaction.model.js";
import  orderSuccessEmail  from "../emailTemplates/orderTemplate.js";
import { sendEmail } from "../utils/sendEmail.js"

const stripe_pk = process.env.STRIPE_PRIVATE_KEY;

//Create Order
const createOrder = asyncHandler(async (req, res) => {
    const {
      orderDate,
      orderTime,
      orderAmount,
      orderStatus,
      cartItems,
      shippingAddress,
      paymentMethod,
      coupon,
    } = req.body;
  
    //   Validation
    if (!cartItems || !orderStatus || !shippingAddress || !paymentMethod) {
      res.status(400);
      throw new Error("Order data missing!!!");
    }
  
    const updatedProduct = await updateProductQuantity(cartItems);
  
    // Create Order
    await Order.create({
      user: req.user.id,
      orderDate,
      orderTime,
      orderAmount,
      orderStatus,
      cartItems,
      shippingAddress,
      paymentMethod,
      coupon,
    });
  
    // Send Order Email to the user
    const subject = "EchoShop Order Placed";
    const send_to = req.user.email;
    const template = orderSuccessEmail(req.user.name, cartItems);
    const reply_to = "no_reply@echoshop.com";
  
    await sendEmail(subject, send_to, template, reply_to);
  
    res.status(201).json({ message: "Order Created" });
});
  
//Get Orders
const getOrders = asyncHandler(async (req, res) => {
    let orders;
  
    if (req.user.role === "admin") {
      orders = await Order.find().sort("-createdAt");
      return res.status(200).json(orders);
    }
    orders = await Order.find({ user: req.user._id }).sort("-createdAt");
    res.status(200).json(orders);
});

//Get Single Order 
const getOrder = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    // if product doesnt exist
    if (!order) {
      res.status(404);
      throw new Error("Order not found");
    }
    if (req.user.role === "admin") {
      return res.status(200).json(order);
    }
    // Match Order to its user
    if (order.user.toString() !== req.user.id) {
      res.status(401);
      throw new Error("User not authorized");
    }
    res.status(200).json(order);
});

//Update Order Status 
const updateOrderStatus = asyncHandler(async (req, res) => {
    const { orderStatus } = req.body;
    const { id } = req.params;
  
    const order = await Order.findById(id);
  
    // if product doesnt exist
    if (!order) {
      res.status(404);
      throw new Error("Order not found");
    }
  
    // Update Product
    await Order.findByIdAndUpdate(
      { _id: id },
      {
        orderStatus: orderStatus,
      },
      {
        new: true,
        runValidators: true,
      }
    );
  
    res.status(200).json({ message: "Order status updated" });
});

// Pay with stripe
const payWithStripe = asyncHandler(async (req, res) => {
    const { items, shipping, description, coupon } = req.body;
    const products = await Product.find();
  
    let orderAmount;
    orderAmount = calculateTotalPrice(products, items);
    if (coupon !== null && coupon?.name !== "nil") {
      let totalAfterDiscount =
        orderAmount - (orderAmount * coupon.discount) / 100;
      orderAmount = totalAfterDiscount;
    }
  
    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: orderAmount,
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
      description,
      shipping: {
        address: {
          line1: shipping.line1,
          line2: shipping.line2,
          city: shipping.city,
          country: shipping.country,
          postal_code: shipping.postal_code,
        },
        name: shipping.name,
        phone: shipping.phone,
      },
      // receipt_email: customerEmail
    });  
  
    res.send({
      clientSecret: paymentIntent.client_secret,
    });
});

// pAYWith Wallet
// Pay with Wallet
const payWithWallet = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    const { items, cartItems, shippingAddress, coupon } = req.body;
    const products = await Product.find();
    const today = new Date();
  
    let orderAmount;
    orderAmount = calculateTotalPrice(products, items);
    if (coupon !== null && coupon?.name !== "nil") {
      let totalAfterDiscount =
        orderAmount - (orderAmount * coupon.discount) / 100;
      orderAmount = totalAfterDiscount;
    }
  
    if (user.balance < orderAmount) {
      res.status(400);
      throw new Error("Insufficient balance");
    }
  
    const newTransaction = await Transaction.create({
      amount: orderAmount,
      sender: user.email,
      receiver: "EchoShop store",
      description: "Payment for products.",
      status: "success",
    });
  
    // decrease the sender's balance
    const newBalance = await User.findOneAndUpdate(
      { email: user.email },
      {
        $inc: { balance: -orderAmount },
      }
    );
  
    const newOrder = await Order.create({
      user: user._id,
      orderDate: today.toDateString(),
      orderTime: today.toLocaleTimeString(),
      orderAmount,
      orderStatus: "Order Placed...",
      cartItems,
      shippingAddress,
      paymentMethod: "EchoShop Wallet",
      coupon,
    });
  
    // Update Product quantity
    const updatedProduct = await updateProductQuantity(cartItems);
  
    // Send Order Email to the user
    const subject = "EchoShop Order Placed";
    const send_to = user.email;
    const template = orderSuccessEmail(user.name, cartItems);
    const reply_to = "no-reply@echoshop.com";
  
    await sendEmail(subject, send_to, template, reply_to);
  
    if (newTransaction && newBalance && newOrder) {
      return res.status(200).json({
        message: "Payment successful",
        url: `${process.env.FRONTEND_URL}/checkout-success`,
      });
    }
    res
      .status(400)
      .json({ message: "Something went wrong, please contact admin" });
});
  
const updateProductQuantity = async (cartItems) => {
    // Update Product quantity
    let bulkOption = cartItems.map((product) => {
      return {
        updateOne: {
          filter: { _id: product._id }, // IMPORTANT item.product
          update: {
            $inc: {
              quantity: -product.cartQuantity,
              sold: +product.cartQuantity,
            },
          },
        },
      };
    });
    let updatedProduct = await Product.bulkWrite(bulkOption, {});
};

export { 
            createOrder, 
            getOrders, 
            getOrder, 
            updateOrderStatus,
            payWithStripe,
            payWithWallet,
            updateProductQuantity
        }