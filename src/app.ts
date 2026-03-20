import express, { Application, Request, Response } from "express";


import { prisma } from "./app/lib/prisma";
import { IndexRoutes } from "./app/routes";
import { notFound } from "./app/middleware/notFound";
import cookieParser from "cookie-parser";


const app: Application = express();


// Enable URL-encoded form data parsing
app.use(express.urlencoded({ extended: true }));

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cookieParser())

app.use("/api/v1", IndexRoutes);

// Basic route
app.get('/', async (req: Request, res: Response) => {

    const PracticeArea = await prisma.practiceArea.create({
        data: {
            title: 'Criminal Law'
        }
    })
    res.status(201).json({
        success: true,
        message: 'API is working',
        data: PracticeArea
    })
});

// app.use(globalErrorHandler)
app.use(notFound)

export default app;