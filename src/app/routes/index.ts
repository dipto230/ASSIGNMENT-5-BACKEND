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
import { PaymentRoutes } from "../module/payment/payment.route";
import { StatsRoutes } from "../module/stats/stats.routes";
import { ConsultationNoteRoutes } from "../module/ConsultationNote/consultationNote.routes";
import { AIRoutes } from "../module/ai/ai.route";

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
router.use("/payments", PaymentRoutes)
router.use("/stats", StatsRoutes)
router.use("/consultation-notes", ConsultationNoteRoutes);
router.use("/ai", AIRoutes);


export const IndexRoutes = router