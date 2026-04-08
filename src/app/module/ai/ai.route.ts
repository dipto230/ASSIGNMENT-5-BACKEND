import express from "express";
import { AIController } from "./ai.controller";

const router = express.Router();

router.post("/chat", AIController.chat);
router.post("/search", AIController.search);

export const AIRoutes = router;