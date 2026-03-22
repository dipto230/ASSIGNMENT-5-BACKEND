import { Router } from "express";
import { PracticeAreaRoutes } from "../module/PracticeArea/practiceArea.route";
import { AuthRoutes } from "../module/auth/auth.route";
import { UserRoutes } from "../module/user/user.route";
import { lawyerRoutes } from "../module/lawyer/lawyer.route";
import { AdminRoutes } from "../module/admin/admin.route";
import { scheduleRoutes } from "../module/schedule/schedule.route";
import { LawyerScheduleRoutes } from "../module/lawyerSchedule/lawyerSchedule.route";
import { AppointmentRoutes } from "../module/appointment/appointment.routes";
import { ClientRoutes } from "../module/client/client.routes";
import { ReviewRoutes } from "../module/review/review.route";

const router = Router()
router.use("/auth", AuthRoutes)
router.use("/practiceArea", PracticeAreaRoutes)
router.use("/users", UserRoutes)
router.use("/lawyers", lawyerRoutes)
router.use("/admins", AdminRoutes)
router.use("/schedules", scheduleRoutes)
router.use("/lawyer-schedules", LawyerScheduleRoutes)
router.use("/appointments", AppointmentRoutes)
router.use("/clients", ClientRoutes)
router.use("/reviews", ReviewRoutes)

export const IndexRoutes = router