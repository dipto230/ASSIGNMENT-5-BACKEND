import { Request, Response } from "express";
import status from "http-status";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { UserService } from "./user.service";

const createLawyer = catchAsync(
    async (req: Request, res: Response) => {
        const payload = req.body;

        const result = await UserService.createLawyer(payload);

        sendResponse(res, {
            httpStatusCode: status.CREATED,
            success: true,
            message: "Lawyer registered successfully",
            data: result,
        })
    }
)

export const UserController = {
    createLawyer,
};