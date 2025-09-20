import dotenv from 'dotenv'

dotenv.config() 

interface config {
    port: number,
    ENV : string, 
    databaseUrl: string,
}

const config : config = {
    port: Number(process.env.PORT) || 3000,
    ENV: process.env.NODE_ENV || 'development',
    databaseUrl: process.env.DATABASE_URL || '',
}

export default config