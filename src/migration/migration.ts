import pg from 'pg'
import config from '../config/index.ts'

const {Pool} = pg;

const pool = new Pool({
    connectionString: config.databaseUrl,
})

async function dbUp() {
    const client = await pool.connect();
    
    try {
      await client.query(`
        -- Enable PostGIS extension
        CREATE EXTENSION IF NOT EXISTS postgis;
        
        -- Create the notes table
        CREATE TABLE notes (
          id SERIAL PRIMARY KEY,
          lat DECIMAL(10, 8) NOT NULL,
          long DECIMAL(11, 8) NOT NULL,
          message TEXT NOT NULL,
          geom GEOMETRY(POINT, 4326),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        -- Create spatial index
        CREATE INDEX notes_geom_idx ON notes USING GIST(geom);
        
        -- Create trigger function
        CREATE OR REPLACE FUNCTION update_notes_geom()
        RETURNS TRIGGER AS $$
        BEGIN
            NEW.geom = ST_SetSRID(ST_Point(NEW.long, NEW.lat), 4326);
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;
        
        -- Create trigger
        CREATE TRIGGER notes_geom_trigger
            BEFORE INSERT OR UPDATE ON notes
            FOR EACH ROW
            EXECUTE FUNCTION update_notes_geom();
      `);
      
      console.log('Migration completed successfully');
    } catch (error) {
      console.error('Migration failed:', error);
      throw error;
    } finally {
      client.release(); 
    }
}

dbUp().catch(console.error);

  