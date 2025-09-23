import { Router, type Express } from "express";
import notesRoute from '../api/v1/notes/notes.routes.js';

const Route = (app : Express) => {
    const routes = Router();

    routes.use('/notes', notesRoute);
    app.use('/api/v1', routes);
};

export default Route;