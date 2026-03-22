// consultationNote.controller.ts
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { catchAsync } from '../../shared/catchAsync';
import { sendResponse } from '../../shared/sendResponse';
import { ConsultationNoteService } from './consultationNote.service';

const giveConsultationNote = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body;
    const user = req.user;
    const result = await ConsultationNoteService.giveConsultationNote(user, payload);
    sendResponse(res, {
        httpStatusCode: httpStatus.OK,
        success: true,
        message: 'Consultation note created successfully',
        data: result,
    });
});

const myConsultationNotes = catchAsync(async (req: Request, res: Response) => {
    const user = req.user;
    const result = await ConsultationNoteService.myConsultationNotes(user);
    sendResponse(res, {
        httpStatusCode: httpStatus.OK,
        success: true,
        message: 'Consultation notes fetched successfully',
        data: result
    });
});

const getAllConsultationNotes = catchAsync(async (req: Request, res: Response) => {
    const result = await ConsultationNoteService.getAllConsultationNotes();
    sendResponse(res, {
        httpStatusCode: httpStatus.OK,
        success: true,
        message: 'Consultation notes retrieved successfully',
        data: result
    });
});

const updateConsultationNote = catchAsync(async (req: Request, res: Response) => {
    const user = req.user;
    const noteId = req.params.id;
    const payload = req.body;
    const result = await ConsultationNoteService.updateConsultationNote(user, noteId as string, payload);
    sendResponse(res, {
        httpStatusCode: httpStatus.OK,
        success: true,
        message: 'Consultation note updated successfully',
        data: result
    });
});

const deleteConsultationNote = catchAsync(async (req: Request, res: Response) => {
    const user = req.user;
    const noteId = req.params.id;
    await ConsultationNoteService.deleteConsultationNote(user, noteId as string);
    sendResponse(res, {
        httpStatusCode: httpStatus.OK,
        success: true,
        message: 'Consultation note deleted successfully',
    });
});

export const ConsultationNoteController = {
    giveConsultationNote,
    myConsultationNotes,
    getAllConsultationNotes,
    updateConsultationNote,
    deleteConsultationNote
};
