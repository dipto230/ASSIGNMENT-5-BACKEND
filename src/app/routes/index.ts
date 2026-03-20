import { Router } from "express";
import { PracticeAreaRoutes } from "../module/PracticeArea/practiceArea.route";
import { AuthRoutes } from "../module/auth/auth.route";
import { UserRoutes } from "../module/user/user.route";
import { lawyerRoutes } from "../module/lawyer/lawyer.route";

const router = Router()
router.use("/auth", AuthRoutes)
router.use("/practiceArea", PracticeAreaRoutes)

router.use("/users", UserRoutes)
router.use("/lawyers", lawyerRoutes)

export const IndexRoutes = router