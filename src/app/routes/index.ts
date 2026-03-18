import { Router } from "express";
import { PracticeAreaRoutes } from "../module/PracticeArea/practiceArea.route";

const router = Router()

router.use("/practiceArea", PracticeAreaRoutes)

export const IndexRoutes = router