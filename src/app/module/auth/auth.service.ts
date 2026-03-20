import { Role, UserStatus } from "../../../generated/prisma/client";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";


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


        return {
            ...data,
            client
            
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

    return data;

}





export const AuthService = {
    registerUser,
    loginUser
};