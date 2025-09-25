import pg from 'pg'
import config from '../config/index.js'

const { Pool } = pg
const pool = new Pool({
    connectionString: config.databaseUrl,
})

interface Message {
    message: string
}

interface Location {
    latitude: number,
    longitude: number
}

interface Radius {
    radius: number
}

interface CreateNoteParams extends Message, Location {}
interface GetNotesParams extends Location, Radius {}

export const noteService = {
    async createNote(note: CreateNoteParams){

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
    ,
    async getNotes(notesWithin: GetNotesParams){

        const {latitude, longitude} = notesWithin;

        let radius = notesWithin.radius;

        if(!radius){
            radius = 1000;
        }

        const query = `
        SELECT 
        id, 
        lat, 
        long, 
        message,
        ROUND(ST_DistanceSphere(geom, ST_SetSRID(ST_Point(${longitude},${latitude}), 4326))::numeric, 0) as distance_meters
        FROM notes 
        WHERE ST_DistanceSphere(geom, ST_SetSRID(ST_Point(${longitude},${latitude}), 4326)) <= ${radius}
        ORDER BY ST_DistanceSphere(geom, ST_SetSRID(ST_Point(${longitude},${latitude}), 4326));
        `
        
        const result = await pool.query(query)

        return result.rows[0];
    }
}
