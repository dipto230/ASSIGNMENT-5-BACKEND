import { Response,Request } from "express";
import { PracticeService } from "./practiceArea.service";


const createPracticeArea = async (req: Request, res: Response) => {
    const payload = req.body;
    const result = await PracticeService.createPracticeArea(payload);

    res.status(201).json({
        success: true,
        message: "Specialty created successfully",
        data: result
    });
}

export const PracticeAreaController = {
    createPracticeArea
}