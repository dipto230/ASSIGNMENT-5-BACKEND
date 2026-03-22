// consultationNote.routes.ts
import express from 'express';
import { Role } from '../../../generated/prisma/enums';
import { checkAuth } from '../../middleware/checkAuth';
import { validateRequest } from '../../middleware/validateRequest';
import { ConsultationNoteController } from './consultationNote.controller';
import { ConsultationNoteValidation } from './consultationNote.validation';

const router = express.Router();

router.get(
    '/',
    checkAuth(Role.SUPER_ADMIN, Role.ADMIN),
    ConsultationNoteController.getAllConsultationNotes
);

router.get(
    '/my-notes',
    checkAuth(Role.LAWYER, Role.USER),
    ConsultationNoteController.myConsultationNotes
);

router.post(
    '/',
    checkAuth(Role.LAWYER),
    validateRequest(ConsultationNoteValidation.createConsultationNoteZodSchema),
    ConsultationNoteController.giveConsultationNote
);

router.patch(
    '/:id',
    checkAuth(Role.LAWYER),
    validateRequest(ConsultationNoteValidation.updateConsultationNoteZodSchema),
    ConsultationNoteController.updateConsultationNote
);

router.delete(
    '/:id',
    checkAuth(Role.LAWYER),
    ConsultationNoteController.deleteConsultationNote
);

export const ConsultationNoteRoutes = router;
