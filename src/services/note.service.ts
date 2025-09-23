import pg from 'pg'
import config from '../config/index.js'

const { Pool } = pg
const pool = new Pool({
    connectionString: config.databaseUrl,
})

interface Note{
    latitude: number,
    longitude:number,
    message:string
}

export const noteService = {
    async createNote(note : Note){

        const query = `
        INSERT INTO notes(lat,long,message) 
        VALUES  ($1,$2,$3)
        RETURNING * `

        const result = await pool.query(query, [
            note.latitude,
            note.longitude,
            note.message
        ])

        return result.rows[0];
    }
}
