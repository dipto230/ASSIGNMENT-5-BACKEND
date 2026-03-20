import { Router } from "express";
import { PracticeAreaController } from "./practiceArea.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";

const router = Router()

router.post('/', PracticeAreaController.createPracticeArea)
router.get('/',checkAuth(Role.ADMIN,Role.LAWYER, Role.SUPER_ADMIN), PracticeAreaController.getAllPracticeArea)
router.delete('/:id', PracticeAreaController.deletePracticeArea)


export const PracticeAreaRoutes = router