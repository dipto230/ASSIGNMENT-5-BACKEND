import { prisma } from "../../lib/prisma";
import { IRequestUser } from "../../interfaces/requestUser.interface";
import { Role } from "../../../generated/prisma/enums";
import status from "http-status";
import AppError from "../../errorHelpers/AppError";

const getDashboardStatsData = async (user: IRequestUser) => {
    switch (user.role) {
        case Role.LAWYER:
            return getLawyerStatsData(user);
        case Role.USER:
            return getClientStatsData(user);
        case Role.ADMIN:
        case Role.SUPER_ADMIN:
            return getAdminStatsData();
        default:
            throw new AppError(status.BAD_REQUEST, "Invalid user role");
    }
};

const getLawyerStatsData = async (user: IRequestUser) => {
    const lawyer = await prisma.lawyer.findUniqueOrThrow({
        where: { userId: user.userId  },
        include: { appointments: true, consultationNotes: true }
    });

    const totalAppointments = lawyer.appointments.length;
    const totalClients = new Set(lawyer.appointments.map(a => a.clientId)).size;
    const totalConsultationNotes = lawyer.consultationNotes.length;

    const appointmentStatusDistribution = await prisma.appointment.groupBy({
        by: ["status"],
        _count: { id: true },
        where: { lawyerId: lawyer.id }
    });

    const formattedStatusDistribution = appointmentStatusDistribution.map(({ _count, status }) => ({
        status,
        count: _count.id
    }));

    return {
        totalAppointments,
        totalClients,
        totalConsultationNotes,
        appointmentStatusDistribution: formattedStatusDistribution
    };
};

const getClientStatsData = async (user: IRequestUser) => {
    const client = await prisma.client.findUniqueOrThrow({
        where: { userId: user.userId  },
        include: { appointments: true }
    });

    const totalAppointments = client.appointments.length;
    const totalLawyers = new Set(client.appointments.map(a => a.lawyerId)).size;

    const appointmentStatusDistribution = await prisma.appointment.groupBy({
        by: ["status"],
        _count: { id: true },
        where: { clientId: client.id }
    });

    const formattedStatusDistribution = appointmentStatusDistribution.map(({ _count, status }) => ({
        status,
        count: _count.id
    }));

    return {
        totalAppointments,
        totalLawyers,
        appointmentStatusDistribution: formattedStatusDistribution
    };
};

const getAdminStatsData = async () => {
    const totalLawyers = await prisma.lawyer.count();
    const totalClients = await prisma.client.count();
    const totalAppointments = await prisma.appointment.count();
    const totalConsultationNotes = await prisma.consultationNote.count();

    return {
        totalLawyers,
        totalClients,
        totalAppointments,
        totalConsultationNotes
    };
};

export const StatsService = {
    getDashboardStatsData
};
