import express from 'express'
import checkDBConnection from './db/index.ts'
import routes from './routes/routes.ts'
import { noteCleanupJob } from './jobs/noteCleanup.ts'

const app = express()

app.use(express.json())

checkDBConnection()

noteCleanupJob()

routes(app);

export default app