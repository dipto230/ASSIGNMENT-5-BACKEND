import { Router } from "express";
import { PracticeAreaRoutes } from "../module/PracticeArea/practiceArea.route";
import { AuthRoutes } from "../module/auth/auth.route";
import { UserRoutes } from "../module/user/user.route";

const router = Router()
router.use("/auth", AuthRoutes)
router.use("/practiceArea", PracticeAreaRoutes)

router.use("/users", UserRoutes)

export const IndexRoutes = router