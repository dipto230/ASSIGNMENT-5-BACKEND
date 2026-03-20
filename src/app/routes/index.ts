import { Router } from "express";
import { PracticeAreaRoutes } from "../module/PracticeArea/practiceArea.route";
import { AuthRoutes } from "../module/auth/auth.route";

const router = Router()

router.use("/practiceArea", PracticeAreaRoutes)
router.use("/auth", AuthRoutes)

export const IndexRoutes = router