import { Request, Response } from "express";
import status from "http-status";
import { catchAsync } from "../../shared/catchAsync";
import { LawyerService } from "./lawyer.service";
import { sendResponse } from "../../shared/sendResponse";


const getAllLawyers = catchAsync(
    async (req: Request, res: Response) => {

        const result = await LawyerService.getAllLawyers();

        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Lawyers fetched successfully",
            data: result,
        })
    }
)

export const LawyerController = {
    getAllLawyers,
};