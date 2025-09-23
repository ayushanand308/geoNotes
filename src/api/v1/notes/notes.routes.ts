import { Router } from 'express'
import { notesController } from './notes.controller.ts';

const router = Router();

router.post("/" , notesController.createNote)

export default router;
