require('dotenv').config();
module.exports = {
    port: process.env.PORT || 4000,
    mongoUri: process.env.MONGO_URI,
    jwtSecret: process.env.JWT_SECRET || 'changeme',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
    paymentApi: {
        baseUrl: process.env.PAYMENT_API_BASE_URL || '',
        createCollectUrl: process.env.PAYMENT_CREATE_COLLECT_URL || '',
        apiKey: process.env.PAYMENT_API_KEY,
        pgKey: process.env.PG_KEY
    },
    school_id: process.env.SCHOOL_ID,
};
