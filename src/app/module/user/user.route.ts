import { Router } from "express";
import { UserController } from "./user.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { createLawyerZodSchema } from "./user.validation";

const router = Router()

router.post('/create-lawyer',
    validateRequest(createLawyerZodSchema),
    UserController.createLawyer)

export const UserRoutes = router