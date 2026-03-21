import { JwtPayload } from "jsonwebtoken";
import { Role, UserStatus } from "../../../generated/prisma/client";
import AppError from "../../errorHelpers/AppError";
import { IRequestUser } from "../../interfaces/requestUser.interface";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { tokenUtils } from "../../utils/token";
import status from "http-status";
import { envVars } from "../../../config/env";
import { jwtUtils } from "../../utils/jwt";


interface IRegisterUserPayload {
    name: string;
    email: string;
    password: string;
}

const registerUser = async (payload: IRegisterUserPayload) => {
    const { name, email, password } = payload;
    const data = await auth.api.signUpEmail({
        body: {
            name,
            email,
            password,
            role:Role.USER
            }
    })
       if (!data.user) {
        throw new Error("Failed to register user");
    }
    try {
        const client = await prisma.$transaction(async (tx) => {

            const clientTx = await tx.client.create({
                data: {
                    userId: data.user.id,
                    name: payload.name,
                    email: payload.email,
                }
            })

            return clientTx
        })

         const accessToken = tokenUtils.getAccessToken({
            userId: data.user.id,
            role: data.user.role,
            name: data.user.name,
            email: data.user.email,
            status: data.user.status,
            isDeleted: data.user.isDeleted,
            emailVerified: data.user.emailVerified,
         });
        
        const refreshToken = tokenUtils.getRefreshToken({
            userId: data.user.id,
            role: data.user.role,
            name: data.user.name,
            email: data.user.email,
            status: data.user.status,
            isDeleted: data.user.isDeleted,
            emailVerified: data.user.emailVerified,
        });


        return {
            ...data,
            client,
            accessToken,
            refreshToken
            
        }
    } catch (error) {
        console.log("Transaction error :", error)
         await prisma.user.delete({
            where: {
                id: data.user.id
            }
        })
        throw error
    }

}

interface ILoginUserPayload {
    email: string;
    password: string;
}

const loginUser = async (payload: ILoginUserPayload) => {
    const { email, password } = payload;

    const data = await auth.api.signInEmail({
        body: {
            email,
            password,
        }
    })

    if (data.user.status === UserStatus.BLOCKED) {
        throw new Error("User is blocked");
    }

    if (data.user.isDeleted || data.user.status === UserStatus.DELETED) {
        throw new Error("User is deleted");
    }
       const accessToken = tokenUtils.getAccessToken({
        userId: data.user.id,
        role: data.user.role,
        name: data.user.name,
        email: data.user.email,
        status: data.user.status,
        isDeleted: data.user.isDeleted,
        emailVerified: data.user.emailVerified,
       });
       const refreshToken = tokenUtils.getRefreshToken({
        userId: data.user.id,
        role: data.user.role,
        name: data.user.name,
        email: data.user.email,
        status: data.user.status,
        isDeleted: data.user.isDeleted,
        emailVerified: data.user.emailVerified,
    });

    return {
        ...data,
        accessToken,
        refreshToken



    };

}

const getMe = async (user: IRequestUser) => {
    const isUserExists = await prisma.user.findUnique({
        where: {
            id: user.userId,
        },
        include: {
            client: {
                include: {
                    appointments: true,
                    consultationNotes: true,
                    legalDocuments: true,
                    profile: true, 
                }
            },
            lawyer: {
                include: {
                    practiceAreas: {
                        include: {
                            practiceArea: true
                        }
                    },
                    appointments: true,
                    consultationNotes: true,
                    lawyerSchedules: true,
                }
            },
            admin: true,
        }
    })

    if (!isUserExists) {
        throw new AppError(status.NOT_FOUND, "User not found");
    }

    return isUserExists;
}


const getNewToken = async (refreshToken : string, sessionToken : string) => {

    const isSessionTokenExists = await prisma.session.findUnique({
        where : {
            token : sessionToken,
        },
        include : {
            user : true,
        }
    })

    if(!isSessionTokenExists){
        throw new AppError(status.UNAUTHORIZED, "Invalid session token");
    }

    const verifiedRefreshToken = jwtUtils.verifyToken(refreshToken, envVars.REFRESH_TOKEN_SECRET)


    if(!verifiedRefreshToken.success && verifiedRefreshToken.error){
        throw new AppError(status.UNAUTHORIZED, "Invalid refresh token");
    }

    const data = verifiedRefreshToken.data as JwtPayload;

    const newAccessToken = tokenUtils.getAccessToken({
        userId: data.userId,
        role: data.role,
        name: data.name,
        email: data.email,
        status: data.status,
        isDeleted: data.isDeleted,
        emailVerified: data.emailVerified,
    });

    const newRefreshToken = tokenUtils.getRefreshToken({
        userId: data.userId,
        role: data.role,
        name: data.name,
        email: data.email,
        status: data.status,
        isDeleted: data.isDeleted,
        emailVerified: data.emailVerified,
    });

    const {token} = await prisma.session.update({
        where : {
            token : sessionToken
        },
        data : {
            token : sessionToken,
            expiresAt: new Date(Date.now() + 60 * 60 * 60 * 24 * 1000),
            updatedAt: new Date(),
        }
    })

    return {
        accessToken : newAccessToken,
        refreshToken : newRefreshToken,
        sessionToken : token,
    }

}



export const AuthService = {
    registerUser,
    loginUser,
    getMe,
    getNewToken
};