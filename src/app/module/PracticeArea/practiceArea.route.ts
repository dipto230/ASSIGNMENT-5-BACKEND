import { Router } from "express";
import { PracticeAreaController } from "./practiceArea.controller";

const router = Router()

router.post('/', PracticeAreaController.createPracticeArea)
router.get('/', PracticeAreaController.getAllPracticeArea)
router.delete('/:id', PracticeAreaController.deletePracticeArea)


export const PracticeAreaRoutes = router