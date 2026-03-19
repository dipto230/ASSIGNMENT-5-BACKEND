/* eslint-disable @typescript-eslint/no-explicit-any */
import { Response,Request } from "express";
import { PracticeService } from "./practiceArea.service";


const createPracticeArea = async (req: Request, res: Response) => {
    try {
          const payload = req.body;
    const result = await PracticeService.createPracticeArea(payload);

    res.status(201).json({
        success: true,
        message: "PracticeArea created successfully",
        data: result
    });
    
    } catch (error:any) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Failed to create PracticeArea',
            error: error.message
        })
  }
}

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