import pg from 'pg'
import config from '../config/index.ts'
const {Pool,Client} = pg

const pool = new Pool({
    connectionString: config.databaseUrl,
})


const checkDBConnection = async () =>{
    try{
        const result = await pool.query('SELECT NOW()');
        console.log('✅ Database connected successfully!');
        console.log('Current time from DB:', result.rows[0].now);
        return true;
    }catch(error){
        console.log(error," ---> DB connection failed")
    }
}

export default checkDBConnection