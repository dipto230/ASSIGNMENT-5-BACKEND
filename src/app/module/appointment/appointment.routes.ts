import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { checkAuth } from "../../middleware/checkAuth";
import { AppointmentController } from "./appointment.controller";

const router = Router();

router.post("/book-appointment", checkAuth(Role.USER), AppointmentController.bookAppointment);

router.get(
  "/my-appointments",
  checkAuth(Role.USER, Role.LAWYER),
  AppointmentController.getMyAppointments
);

router.get(
  "/:id",
  checkAuth(Role.USER, Role.LAWYER),
  AppointmentController.getMySingleAppointment
);

router.patch(
  "/change-status/:id",
  checkAuth(Role.USER, Role.LAWYER, Role.ADMIN),
  AppointmentController.changeAppointmentStatus
);

router.get(
  "/",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  AppointmentController.getAllAppointments
);

export const AppointmentRoutes = router;
