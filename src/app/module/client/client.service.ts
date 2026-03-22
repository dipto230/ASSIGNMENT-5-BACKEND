import { prisma } from "../../lib/prisma";
import { IRequestUser } from "../../interfaces/requestUser.interface";
import {
  IUpdateClientPayload,
  IUpdateClientProfilePayload,
} from "./client.interface";
import { convertToDateTime } from "./client.utils";

const updateMyProfile = async (
  user: IRequestUser,
  payload: IUpdateClientPayload
) => {
  const clientData = await prisma.client.findUniqueOrThrow({
    where: {
      email: user.email,
    },
    include: {
      profile: true,
    },
  });

  await prisma.$transaction(async (tx) => {
    // client basic info
    if (payload.clientInfo) {
      await tx.client.update({
        where: {
          id: clientData.id,
        },
        data: {
          ...payload.clientInfo,
        },
      });

      if (payload.clientInfo.name || payload.clientInfo.profilePhoto) {
        const userData = {
          name: payload.clientInfo.name
            ? payload.clientInfo.name
            : clientData.name,
          image: payload.clientInfo.profilePhoto
            ? payload.clientInfo.profilePhoto
            : clientData.profilePhoto,
        };

        await tx.user.update({
          where: {
            id: clientData.userId,
          },
          data: userData,
        });
      }
    }

    // client profile
    if (payload.clientProfile) {
      const profileData: IUpdateClientProfilePayload = {
        ...payload.clientProfile,
      };

      if (payload.clientProfile.dateOfBirth) {
        profileData.dateOfBirth = convertToDateTime(
          typeof profileData.dateOfBirth === "string"
            ? profileData.dateOfBirth
            : undefined
        ) as Date;
      }

      await tx.clientProfile.upsert({
        where: {
          clientId: clientData.id,
        },
        update: profileData,
        create: {
          clientId: clientData.id,
          ...profileData,
        },
      });
    }
  });

  const result = await prisma.client.findUnique({
    where: {
      id: clientData.id,
    },
    include: {
      user: true,
      profile: true,
    },
  });

  return result;
};

export const ClientService = {
  updateMyProfile,
};