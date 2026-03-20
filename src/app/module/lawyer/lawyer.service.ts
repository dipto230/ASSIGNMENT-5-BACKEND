import { prisma } from "../../lib/prisma";

const getAllLawyers = async () => {
    const lawyers = await prisma.lawyer.findMany({
        include: {
            user: true,
            practiceAreas: {
                include: {
                    practiceArea: true
                }
            }
        }
    });

    return lawyers;
};

export const LawyerService = {
    getAllLawyers,
};