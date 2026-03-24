import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { LawyerController } from "./lawyer.controller";
import { updateLawyerZodSchema } from "./lawyer.validation";



const router = Router();

router.get("/",
    
    LawyerController.getAllLawyers
);

router.get("/:id",
    
    LawyerController.getLawyerById
);

router.patch("/:id",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    validateRequest(updateLawyerZodSchema),
    LawyerController.updateLawyer
);

router.delete("/:id",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    LawyerController.deleteLawyer
);

export const lawyerRoutes = router;