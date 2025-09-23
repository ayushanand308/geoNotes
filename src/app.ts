import express from 'express'
import checkDBConnection from './db/index.ts'
import routes from './routes/routes.ts'

const app = express()

app.use(express.json())

checkDBConnection()

routes(app);

export default app