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

interface TimePeriod {
    startTime: string
    endTime: string
}

interface CreateNoteParams extends Message, Location {}
interface GetNotesParams extends Location, Radius {}
interface GetNotesWithinTimePeriodParams extends Location, Radius, TimePeriod {}

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
        AND created_at >= NOW() - INTERVAL '24 hours'
        ORDER BY ST_DistanceSphere(geom, ST_SetSRID(ST_Point(${longitude},${latitude}), 4326));
        `
        
        const result = await pool.query(query)

        return result.rows[0];
    }
    ,
    async getNotesWithinTimePeriod(params: GetNotesWithinTimePeriodParams){

        const {latitude, longitude, startTime, endTime} = params;

        let radius = params.radius;

        if(!radius){
            radius = 1000;
        }

        const query = `
        SELECT 
        id, 
        lat, 
        long, 
        message,
        created_at,
        ROUND(ST_DistanceSphere(geom, ST_SetSRID(ST_Point($1,$2), 4326))::numeric, 0) as distance_meters
        FROM notes 
        WHERE ST_DistanceSphere(geom, ST_SetSRID(ST_Point($1,$2), 4326)) <= $3
        AND created_at >= $4
        AND created_at <= $5
        ORDER BY ST_DistanceSphere(geom, ST_SetSRID(ST_Point($1,$2), 4326));
        `
        
        const result = await pool.query(query, [
            longitude,
            latitude,
            radius,
            startTime,
            endTime
        ])

        return result.rows;
    }
    ,
    async noteCleanup(){
        const query = `
        DELETE FROM notes
        WHERE created_at < NOW() - INTERVAL '24 hours'
        `
        const result = await pool.query(query)
        return result.rows[0];
    }
}
