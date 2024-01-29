export default {
    mongoUrl: process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/node-api',
    port: 3030,
    jwtSecret: process.env.JWT_SECRET || '@#A8vB2i(@'
}
