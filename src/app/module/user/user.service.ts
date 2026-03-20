import status from "http-status";
import { Role, PracticeArea } from "../../../generated/prisma/client";

import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { ICreateLawyerPayload } from "./user.interface";
import AppError from "../../errorHelpers/AppError";

const createLawyer = async (payload: ICreateLawyerPayload) => {

    const practiceAreas: PracticeArea[] = [];

    for (const practiceAreaId of payload.practiceAreas) {
        const area = await prisma.practiceArea.findUnique({
            where: {
                id: practiceAreaId
            }
        })

        if (!area) {
            throw new AppError(status.NOT_FOUND, `PracticeArea with id ${practiceAreaId} not found`);
        }

        practiceAreas.push(area);
    }

    const userExists = await prisma.user.findUnique({
        where: {
            email: payload.lawyer.email
        }
    })

    if (userExists) {
        throw new AppError(status.CONFLICT, "User with this email already exists");
    }

    const userData = await auth.api.signUpEmail({
        body: {
            email: payload.lawyer.email,
            password: payload.password,
            role: Role.LAWYER,
            name: payload.lawyer.name,
            needPasswordChange: true,
        }
    })

    try {
        const result = await prisma.$transaction(async (tx) => {

            const lawyerData = await tx.lawyer.create({
                data: {
                    userId: userData.user.id,
                    ...payload.lawyer, // ✅ same pattern maintain
                }
            })

            const lawyerPracticeAreaData = practiceAreas.map((area) => {
                return {
                    lawyerId: lawyerData.id,
                    practiceAreaId: area.id,
                }
            })

            await tx.lawyerPracticeArea.createMany({
                data: lawyerPracticeAreaData
            })

            const lawyer = await tx.lawyer.findUnique({
                where: {
                    id: lawyerData.id
                },
                select: {
                    id: true,
                    userId: true,
                    name: true,
                    email: true,
                    profilePhoto: true,
                    contactNumber: true,
                    address: true,
                    barRegistrationNumber: true,
                    experience: true,
                    gender: true,
                    consultationFee: true,
                    qualification: true,
                    currentFirm: true, // ✅ FIXED
                    designation: true,
                    createdAt: true,
                    updatedAt: true,
                    user: {
                        select: {
                            id: true,
                            email: true,
                            name: true,
                            role: true,
                            status: true,
                            emailVerified: true,
                            image: true,
                            isDeleted: true,
                            deletedAt: true,
                            createdAt: true,
                            updatedAt: true,
                        }
                    },
                    practiceAreas: {
                        select: {
                            practiceArea: {
                                select: {
                                    title: true,
                                    id: true
                                }
                            }
                        }
                    }
                }
            })

            return lawyer;

        })

        return result;

    } catch (error) {
        console.log("Transaction error : ", error);

        await prisma.user.delete({
            where: {
                id: userData.user.id
            }
        })

        throw error;
    }
}

export const UserService = {
    createLawyer,
};