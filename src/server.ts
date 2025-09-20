import app from './app.ts'
import config from './config/index.ts'

app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`)
});