/* eslint-disable @typescript-eslint/no-explicit-any */
import { Response,Request } from "express";
import { PracticeService } from "./practiceArea.service";
import { sendResponse } from "../../shared/sendResponse";
import { catchAsync } from "../../shared/catchAsync";











const createPracticeArea = catchAsync(
    async (req: Request, res: Response) => {
        console.log(req.body);
        console.log(req.file);

        const payload = {
            ...req.body,
            icon: req.file?.path
        };

        const result = await PracticeService.createPracticeArea(payload);

        sendResponse(res, {
            httpStatusCode: 201,
            success: true,
            message: 'PracticeArea created successfully',
            data: result
        });
    }
);




const getAllPracticeArea = async (req: Request, res: Response) => {
    try {
        const practiceArea = await PracticeService.getAllPracticeArea();
        res.status(200).json({
            success: true,
            message: "PracticeArea fetched successfully",
            data:practiceArea
        })
    } catch (error:any) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch practiceArea',
            error: error.message
        });
    }
}

const deletePracticeArea = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await PracticeService.deletePracticeArea(id as string);
        res.status(200).json({
            success: true,
            message: 'PracticeArea deleted successfully',
            data:result
        })
    } catch (error: any) {
         console.log(error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch practiceArea',
            error: error.message
        });
    }
}

export const PracticeAreaController = {
    createPracticeArea,
    getAllPracticeArea,
    deletePracticeArea
}