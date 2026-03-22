// consultationNote.service.ts
import status from 'http-status';
import AppError from '../../errorHelpers/AppError';
import { prisma } from '../../lib/prisma';
import { IRequestUser } from '../../interfaces/requestUser.interface';
import { ICreateConsultationNotePayload, IUpdateConsultationNotePayload } from './consultationNote.interface';
import { Role } from '../../../generated/prisma/enums';

/**
 * Create a consultation note
 */
const giveConsultationNote = async (user: IRequestUser, payload: ICreateConsultationNotePayload) => {
    if (user.role !== Role.LAWYER) {
        throw new AppError(status.FORBIDDEN, "Only lawyers can create consultation notes");
    }

    const appointment = await prisma.appointment.findUniqueOrThrow({
        where: { id: payload.appointmentId }
    });

    const isAlreadyCreated = await prisma.consultationNote.findFirst({
        where: { appointmentId: payload.appointmentId }
    });

    if (isAlreadyCreated) {
        throw new AppError(status.BAD_REQUEST, "Consultation note already exists for this appointment");
    }

    const followUpDate = payload.followUpDate ? new Date(payload.followUpDate) : null;

    const result = await prisma.consultationNote.create({
        data: {
            appointmentId: payload.appointmentId,
            clientId: appointment.clientId,
            lawyerId: appointment.lawyerId,
            notes: payload.notes,
            followUpDate,
        },
        include: {
            appointment: true,
            client: true,
            lawyer: true // ✅ include lawyer relation
        }
    });

    return result;
};

/**
 * Get consultation notes for logged-in user
 */
const myConsultationNotes = async (user: IRequestUser) => {
    if (user.role === Role.LAWYER) {
        return prisma.consultationNote.findMany({
            where: { lawyerId: user.id }, // ✅ use lawyerId instead of email
            include: { appointment: true, client: true, lawyer: true }
        });
    }

    if (user.role === Role.USER) {
        return prisma.consultationNote.findMany({
            where: { clientId: user.id }, // ✅ use clientId
            include: { appointment: true, client: true, lawyer: true }
        });
    }

    throw new AppError(status.FORBIDDEN, "You cannot view consultation notes");
};

/**
 * Get all consultation notes (for admin)
 */
const getAllConsultationNotes = async () => {
    return prisma.consultationNote.findMany({
        include: { appointment: true, client: true, lawyer: true }
    });
};

/**
 * Update consultation note
 */
const updateConsultationNote = async (user: IRequestUser, noteId: string, payload: IUpdateConsultationNotePayload) => {
    const note = await prisma.consultationNote.findUniqueOrThrow({
        where: { id: noteId },
        include: { lawyer: true } // ✅ include lawyer for email/id checks
    });

    if (user.role !== Role.LAWYER || user.id !== note.lawyerId) {
        throw new AppError(status.FORBIDDEN, "You can only update your own consultation notes");
    }

    const updatedFollowUpDate = payload.followUpDate ? new Date(payload.followUpDate) : note.followUpDate;

    const result = await prisma.consultationNote.update({
        where: { id: noteId },
        data: {
            notes: payload.notes || note.notes,
            followUpDate: updatedFollowUpDate
        },
        include: { appointment: true, client: true, lawyer: true }
    });

    return result;
};

/**
 * Delete consultation note
 */
const deleteConsultationNote = async (user: IRequestUser, noteId: string) => {
    const note = await prisma.consultationNote.findUniqueOrThrow({
        where: { id: noteId },
        include: { lawyer: true } // ✅ include lawyer relation
    });

    if (user.role !== Role.LAWYER || user.id !== note.lawyerId) {
        throw new AppError(status.FORBIDDEN, "You can only delete your own consultation notes");
    }

    await prisma.consultationNote.delete({ where: { id: noteId } });
};

export const ConsultationNoteService = {
    giveConsultationNote,
    myConsultationNotes,
    getAllConsultationNotes,
    updateConsultationNote,
    deleteConsultationNote
};
