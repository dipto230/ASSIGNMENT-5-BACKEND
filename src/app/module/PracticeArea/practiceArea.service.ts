import { PracticeArea } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";


const createPracticeArea = async (payload: PracticeArea): Promise<PracticeArea> => {
    const PracticeArea = await prisma.practiceArea.create({
        data:payload
    })
    return PracticeArea
}


export const PracticeService = {
    createPracticeArea
}
