import { noteService } from "../../../services/note.service.ts";
import { noteSchema } from "./notes.validation.ts";
import express, {type Request, type Response, } from 'express';

export const notesController = {
     async createNote(req: Request,res: Response ){
        try{
            const validatedData = noteSchema.parse(req.body);

            const result = await (noteService.createNote(validatedData));

            res.status(201).json({
                success: true,
                data: result
            });
        }catch(error){
            res.status(400).json({
                success:false,
                message: error instanceof Error ? error.message : 'An error occurred'
            })
        }
     }
}