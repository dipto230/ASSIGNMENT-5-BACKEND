import { Router } from "express";
import { PracticeAreaController } from "./practiceArea.controller";

const router = Router()

router.post('/', PracticeAreaController.createPracticeArea)

export const PracticeAreaRoutes = router