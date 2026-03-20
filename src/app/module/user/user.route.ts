import { Router } from "express";
import { UserController } from "./user.controller";

const router = Router()

router.post('/create-lawyer', UserController.createLawyer)

export const UserRoutes = router