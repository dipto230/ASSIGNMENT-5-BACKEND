import { Request, Response } from "express";
import status from "http-status";
import { catchAsync } from "../../shared/catchAsync";
import { LawyerService } from "./lawyer.service";
import { sendResponse } from "../../shared/sendResponse";

const getAllLawyers = catchAsync(async (req: Request, res: Response) => {
    const result = await LawyerService.getAllLawyers();

    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Lawyers fetched successfully",
        data: result,
    });
});

const getLawyerById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await LawyerService.getLawyerById(id as string);

    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Lawyer fetched successfully",
        data: result,
    });
});

const updateLawyer = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const payload = req.body;

    const result = await LawyerService.updateLawyer(id as string, payload);

    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Lawyer updated successfully",
        data: result,
    });
});

const deleteLawyer = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await LawyerService.deleteLawyer(id as string);

    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Lawyer deleted successfully",
        data: result,
    });
});

export const LawyerController = {
    getAllLawyers,
    getLawyerById,
    updateLawyer,
    deleteLawyer,
};