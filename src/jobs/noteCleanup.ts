import cron from 'node-cron';
import { noteService } from '../services/note.service.ts';

export const noteCleanupJob = () => {
    const task = cron.schedule('0 0 * * *', async () => { 
        try {
            await noteService.noteCleanup();
            console.log(`[${new Date().toISOString()}] Cleanup completed`);
        } catch (error) {
            console.error(`[${new Date().toISOString()}] Cleanup failed:`, error);
        }
    },
        {timezone: 'Asia/Kolkata'}
    );
}

