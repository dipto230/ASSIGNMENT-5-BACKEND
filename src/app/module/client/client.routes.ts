import { Router } from "express";

import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { ClientController } from "./client.controller";
import { updateMyClientProfileMiddleware } from "./client.middleware";
import { ClientValidation } from "./client.validation";
import { Role } from "../../../generated/prisma/enums";
import { multerUpload } from "../../../config/multer.config";

const router = Router();

router.patch(
  "/update-my-profile",
  checkAuth(Role.USER),
  multerUpload.fields([
    { name: "profilePhoto", maxCount: 1 }
  ]),
  updateMyClientProfileMiddleware,
  validateRequest(ClientValidation.updateClientZodSchema),
  ClientController.updateMyProfile
);

export const ClientRoutes = router;