export default {
    mongoUrl: process.env.MONGO_URL || 'mongodb://mongo:27017/node-api',
    port: 3030,
    jwtSecret: process.env.JWT_SECRET || '@#A8vB2i(@'
}
