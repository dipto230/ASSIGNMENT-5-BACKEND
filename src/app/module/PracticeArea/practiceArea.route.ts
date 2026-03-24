import { Router } from "express";
import { PracticeAreaController } from "./practiceArea.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";
import { multerUpload } from "../../../config/multer.config";
import { validateRequest } from "../../middleware/validateRequest";
import { PracticeAreaValidation } from "./practiceArea.validation";

const router = Router()

router.post('/',
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    multerUpload.single("file"),
    validateRequest(PracticeAreaValidation.createPracticeAreaZodSchema),
    PracticeAreaController.createPracticeArea)
router.get('/', PracticeAreaController.getAllPracticeArea)
router.delete('/:id',checkAuth(Role.ADMIN, Role.SUPER_ADMIN), PracticeAreaController.deletePracticeArea)


export const PracticeAreaRoutes = router