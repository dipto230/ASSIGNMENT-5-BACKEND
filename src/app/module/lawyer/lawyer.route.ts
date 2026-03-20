import { Router } from "express";
import { LawyerController } from "./lawyer.controller";

const router = Router()

router.get("/", LawyerController.getAllLawyers)

export const lawyerRoutes = router;