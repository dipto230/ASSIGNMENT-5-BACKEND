/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { Application, Request, Response } from "express";
import path from "path";
import cookieParser from "cookie-parser";
import cors from "cors";
import cron from "node-cron";

import { IndexRoutes } from "./app/routes";
import { notFound } from "./app/middleware/notFound";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./app/lib/auth";
import { envVars } from "./config/env";
import { AppointmentService } from "./app/module/appointment/appointment.service";

const app: Application = express();


app.set("view engine", "ejs");
app.set("views", path.resolve(process.cwd(), `src/app/templates`));


app.post("/webhook", express.raw({ type: "application/json" }), async (req: Request, res: Response) => {
    console.log("webhook received:", req.body);
    res.status(200).json({ received: true });
});

// 🔹 CORS
const isProduction = envVars.NODE_ENV === "production";

const allowedOrigins = [
    envVars.FRONTEND_URL,
    envVars.BETTER_AUTH_URL,
    "http://localhost:3000",
    "http://localhost:5000"
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or Vercel deployments)
        if (!origin) return callback(null, true);
        
        // Check if origin is in allowedOrigins
        if (allowedOrigins.some(allowed => origin.includes(allowed))) {
            return callback(null, true);
        }
        
        console.log(`❌ CORS blocked origin: ${origin}`);
        return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    exposedHeaders: ["Set-Cookie"],
}));


app.use(cookieParser());


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use((req, res, next) => {
    console.log("🍪 Cookies:", req.cookies);
    next();
});

app.use("/api/auth", toNodeHandler(auth));


app.use("/api/v1", IndexRoutes);


cron.schedule("*/25 * * * *", async () => {
    try {
        console.log("Running cron job to cancel unpaid appointments...");
        await AppointmentService.cancelUnpaidAppointments();
    } catch (error: any) {
        console.error("Error occurred while canceling unpaid appointments:", error.message);    
    }
});


app.get('/', async (req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        message: 'API is working'
    });
});


app.use(notFound);

export default app;