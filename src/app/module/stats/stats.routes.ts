import express from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";
import { StatsController } from "./stats.controller";

const router = express.Router();

router.get(
    "/",
    checkAuth(Role.LAWYER, Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
    StatsController.getDashboardStatsData
);

export const StatsRoutes = router;
