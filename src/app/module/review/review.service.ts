import status from "http-status";
import { PaymentStatus, Role } from "../../../generated/prisma/enums";
import AppError from "../../errorHelpers/AppError";
import { IRequestUser } from "../../interfaces/requestUser.interface";
import { prisma } from "../../lib/prisma";
import { ICreateReviewPayload, IUpdateReviewPayload } from "./review.interface";

const giveReview = async (user: IRequestUser, payload: ICreateReviewPayload) => {
    const clientData = await prisma.client.findUniqueOrThrow({
        where: { email: user.email }
    });

    const appointmentData = await prisma.appointment.findUniqueOrThrow({
        where: { id: payload.appointmentId }
    });

    if (appointmentData.paymentStatus !== PaymentStatus.PAID) {
        throw new AppError(status.BAD_REQUEST, "You can only review after payment is done");
    }

    if (appointmentData.clientId !== clientData.id) {
        throw new AppError(status.BAD_REQUEST, "You can only review your own appointments");
    }

    const isReviewed = await prisma.review.findFirst({
        where: { appointmentId: payload.appointmentId }
    });

    if (isReviewed) {
        throw new AppError(status.BAD_REQUEST, "You have already reviewed this appointment. You can update your review instead.");
    }

    const result = await prisma.$transaction(async (tx) => {
        const review = await tx.review.create({
            data: {
                ...payload,
                clientId: appointmentData.clientId,
                lawyerId: appointmentData.lawyerId
            }
        });

        const averageRating = await tx.review.aggregate({
            where: { lawyerId: appointmentData.lawyerId },
            _avg: { rating: true }
        });

        await tx.lawyer.update({
            where: { id: appointmentData.lawyerId },
            data: { averageRating: averageRating._avg.rating as number }
        });

        return review;
    });

    return result;
};

const getAllReviews = async () => {
    return await prisma.review.findMany({
        include: { lawyer: true, client: true, appointment: true }
    });
};

const myReviews = async (user: IRequestUser) => {
    const isUserExist = await prisma.user.findUnique({
        where: { email: user?.email }
    });
    if (!isUserExist) {
        throw new AppError(status.BAD_REQUEST, "Only clients or lawyers can view their reviews");
    }

    if (isUserExist.role === Role.LAWYER) {
        const lawyerData = await prisma.lawyer.findUniqueOrThrow({
            where: { email: user?.email }
        });
        return await prisma.review.findMany({
            where: { lawyerId: lawyerData.id },
            include: { client: true, appointment: true }
        });
    }

    if (isUserExist.role === Role.USER) {
        const clientData = await prisma.client.findUniqueOrThrow({
            where: { email: user?.email }
        });
        return await prisma.review.findMany({
            where: { clientId: clientData.id },
            include: { lawyer: true, appointment: true }
        });
    }
};

const updateReview = async (user: IRequestUser, reviewId: string, payload: IUpdateReviewPayload) => {
    const clientData = await prisma.client.findUniqueOrThrow({
        where: { email: user?.email }
    });

    const reviewData = await prisma.review.findUniqueOrThrow({ where: { id: reviewId } });

    if (clientData.id !== reviewData.clientId) {
        throw new AppError(status.BAD_REQUEST, "This is not your review!");
    }

    const result = await prisma.$transaction(async (tx) => {
        const updatedReview = await tx.review.update({
            where: { id: reviewId },
            data: { ...payload }
        });

        const averageRating = await tx.review.aggregate({
            where: { lawyerId: reviewData.lawyerId },
            _avg: { rating: true }
        });

        await tx.lawyer.update({
            where: { id: updatedReview.lawyerId },
            data: { averageRating: averageRating._avg.rating as number }
        });

        return updatedReview;
    });

    return result;
};

const deleteReview = async (user: IRequestUser, reviewId: string) => {
    const clientData = await prisma.client.findUniqueOrThrow({
        where: { email: user?.email }
    });

    const reviewData = await prisma.review.findUniqueOrThrow({ where: { id: reviewId } });

    if (clientData.id !== reviewData.clientId) {
        throw new AppError(status.BAD_REQUEST, "This is not your review!");
    }

    const result = await prisma.$transaction(async (tx) => {
        const deletedReview = await tx.review.delete({ where: { id: reviewId } });

        const averageRating = await tx.review.aggregate({
            where: { lawyerId: deletedReview.lawyerId },
            _avg: { rating: true }
        });

        await tx.lawyer.update({
            where: { id: deletedReview.lawyerId },
            data: { averageRating: averageRating._avg.rating as number }
        });

        return deletedReview;
    });

    return result;
};

export const ReviewService = { giveReview, getAllReviews, myReviews, updateReview, deleteReview };
