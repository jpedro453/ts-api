import dotenv from 'dotenv'
import path from 'path'
const envPath = path.join(__dirname, '..', '..', '..', '.env')
dotenv.config({ path: envPath })

export default {
    mongoUrl: process.env.MONGO_URL,
    port: 3030,
    jwtSecret: process.env.JWT_SECRET
}
