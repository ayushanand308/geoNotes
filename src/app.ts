import express from 'express'
import checkDBConnection from './db/index.ts'

const app = express()

app.use(express.json())

checkDBConnection()

export default app