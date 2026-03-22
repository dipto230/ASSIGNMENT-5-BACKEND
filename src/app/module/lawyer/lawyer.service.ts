import status from "http-status";
import { UserStatus } from "../../../generated/prisma/enums";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";
import { IUpdateLawyerPayload } from "./lawyer.interface";


import { IQueryParams } from "../../interfaces/query.interface";
import { QueryBuilder } from "../../utils/QueryBuilder";

// 🔹 searchable & filterable config
const lawyerSearchableFields = [
  "name",
  "email",
  "user.name",
  "user.email",
  "practiceAreas.practiceArea.title",
];

const lawyerFilterableFields = [
  "gender",
  "consultationFee",
  "experience",
  "currentFirm",
];

// ✅ GET ALL (WITH QUERY BUILDER)
const getAllLawyers = async (query: IQueryParams) => {
  const queryBuilder = new QueryBuilder(
    prisma.lawyer,
    query,
    {
      searchableFields: lawyerSearchableFields,
      filterableFields: lawyerFilterableFields,
    }
  )
    .search()
    .filter()
    .paginate()
    .sort()
    .include({
      user: true,
      practiceAreas: {
        include: {
          practiceArea: true,
        },
      },
    });

  const result = await queryBuilder.execute();

  return result;
};

// ✅ GET BY ID
const getLawyerById = async (id: string) => {
  const lawyer = await prisma.lawyer.findUnique({
    where: {
      id,
      isDeleted: false,
    },
    include: {
      user: true,
      practiceAreas: {
        include: {
          practiceArea: true,
        },
      },
      appointments: {
        include: {
          client: true,
          schedule: true,
          consultationNote: true,
        },
      },
      lawyerSchedules: {
        include: {
          schedule: true,
        },
      },
    },
  });

  return lawyer;
};

// ✅ UPDATE
const updateLawyer = async (id: string, payload: IUpdateLawyerPayload) => {
  const isExist = await prisma.lawyer.findUnique({
    where: { id },
  });

  if (!isExist) {
    throw new AppError(status.NOT_FOUND, "Lawyer not found");
  }

  const { lawyer, practiceAreas } = payload;

  await prisma.$transaction(async (tx) => {
    // 🔹 update basic
    if (lawyer) {
      await tx.lawyer.update({
        where: { id },
        data: { ...lawyer },
      });
    }

    // 🔹 update practice areas
    if (practiceAreas && practiceAreas.length > 0) {
      for (const area of practiceAreas) {
        const { practiceAreaId, shouldDelete } = area;

        if (shouldDelete) {
          await tx.lawyerPracticeArea.delete({
            where: {
              lawyerId_practiceAreaId: {
                lawyerId: id,
                practiceAreaId,
              },
            },
          });
        } else {
          await tx.lawyerPracticeArea.upsert({
            where: {
              lawyerId_practiceAreaId: {
                lawyerId: id,
                practiceAreaId,
              },
            },
            create: {
              lawyerId: id,
              practiceAreaId,
            },
            update: {},
          });
        }
      }
    }
  });

  return await getLawyerById(id);
};

// ✅ DELETE (SOFT)
const deleteLawyer = async (id: string) => {
  const isExist = await prisma.lawyer.findUnique({
    where: { id },
    include: { user: true },
  });

  if (!isExist) {
    throw new AppError(status.NOT_FOUND, "Lawyer not found");
  }

  await prisma.$transaction(async (tx) => {
    await tx.lawyer.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });

    await tx.user.update({
      where: { id: isExist.userId },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
        status: UserStatus.DELETED,
      },
    });

    await tx.session.deleteMany({
      where: { userId: isExist.userId },
    });

    await tx.lawyerPracticeArea.deleteMany({
      where: { lawyerId: id },
    });
  });

  return { message: "Lawyer deleted successfully" };
};

export const LawyerService = {
  getAllLawyers,
  getLawyerById,
  updateLawyer,
  deleteLawyer,
};