import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { checkAuth } from "../../middleware/checkAuth";
import { LawyerScheduleController } from "./lawyerSchedule.controller";

const router = Router();


router.post(
  "/create-my-lawyer-schedule",
  checkAuth(Role.LAWYER),
  LawyerScheduleController.createMyLawyerSchedule
);


router.get(
  "/my-lawyer-schedules",
  checkAuth(Role.LAWYER),
  LawyerScheduleController.getMyLawyerSchedules
);


router.get(
  "/",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN,Role.LAWYER, Role.USER),
  LawyerScheduleController.getAllLawyerSchedules
);


router.get(
  "/:lawyerId/schedule/:scheduleId",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  LawyerScheduleController.getLawyerScheduleById
);


router.patch(
  "/update-my-lawyer-schedule",
  checkAuth(Role.LAWYER),
  LawyerScheduleController.updateMyLawyerSchedule
);


router.delete(
  "/delete-my-lawyer-schedule/:id",
  checkAuth(Role.LAWYER),
  LawyerScheduleController.deleteMyLawyerSchedule
);

export const LawyerScheduleRoutes = router;
