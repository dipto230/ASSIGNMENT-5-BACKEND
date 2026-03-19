import { PracticeArea } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";



const createPracticeArea = async (payload: PracticeArea): Promise<PracticeArea> => {
    const PracticeArea = await prisma.practiceArea.create({
        data:payload
    })
    return PracticeArea
}

const getAllPracticeArea = async (): Promise<PracticeArea[]> => {
    const PracticeArea = await prisma.practiceArea.findMany()
    return PracticeArea;
}

const deletePracticeArea = async (id: string): Promise<PracticeArea> => {
    const Practice = await prisma.practiceArea.delete({
        where:{id}
    })
    return Practice
}

export const PracticeService = {
    createPracticeArea,
    getAllPracticeArea,
    deletePracticeArea
}
