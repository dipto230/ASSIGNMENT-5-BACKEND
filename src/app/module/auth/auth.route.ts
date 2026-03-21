import { Router } from "express";
import { AuthController } from "./auth.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";
const router = Router()

router.post("/register", AuthController.registerUser)
router.post("/login", AuthController.loginUser)
router.get("/me", checkAuth(Role.ADMIN, Role.SUPER_ADMIN, Role.LAWYER, Role.USER), AuthController.getMe)
router.post("/refresh-token", AuthController.getNewToken)
router.post("/change-password", checkAuth(Role.ADMIN, Role.SUPER_ADMIN, Role.USER, Role.LAWYER), AuthController.changePassword)
router.post("/logout", checkAuth(Role.ADMIN, Role.SUPER_ADMIN, Role.USER, Role.LAWYER), AuthController.logoutUser)
export const AuthRoutes = router;