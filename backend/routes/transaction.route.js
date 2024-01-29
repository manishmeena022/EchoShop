import express, { Router } from "express";
import {protect} from "../middleware/authMiddleware.js";
import { depositFundStripe, getUserTransactions, transferFund, verifyAccount, webhook } from "../controllers/transaction.controller.js";

const transactionRoute = Router();

transactionRoute.post("/transferFund", express.json(), protect, transferFund);
transactionRoute.post("/verifyAccount", express.json(), protect, verifyAccount);
transactionRoute.post("/getUserTransactions",express.json(), protect, getUserTransactions);
transactionRoute.post("/depositFundStripe", express.json(), protect, depositFundStripe);
transactionRoute.post("/webhook", express.raw({ type: "application/json" }), webhook);

export default transactionRoute;