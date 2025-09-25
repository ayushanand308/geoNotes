import { Router } from 'express'
import { notesController } from './notes.controller.ts';

const router = Router();

router.post("/" , notesController.createNote)
router.post("/within" , notesController.getNotes)

export default router;
