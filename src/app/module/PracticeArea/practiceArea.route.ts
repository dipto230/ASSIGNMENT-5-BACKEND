import { Router } from "express";
import { PracticeAreaController } from "./practiceArea.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";

const router = Router()

router.post('/',checkAuth(Role.ADMIN, Role.SUPER_ADMIN), PracticeAreaController.createPracticeArea)
router.get('/', PracticeAreaController.getAllPracticeArea)
router.delete('/:id',checkAuth(Role.ADMIN, Role.SUPER_ADMIN), PracticeAreaController.deletePracticeArea)


export const PracticeAreaRoutes = router