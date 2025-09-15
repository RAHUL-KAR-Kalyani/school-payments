const app = require('./app');
const config = require('./config/config');
const mongoose = require('mongoose');
const logger = require('./utils/logger');

mongoose.set('strictQuery', true);

async function start() {
    try {
        await mongoose.connect(config.mongoUri, {});
        console.log('MongoDB connected');
        app.get('/', (req, res) => {
            return res.send('Server is running...........');
        });
        app.listen(config.port, () => {
            logger.info(`Server OK. http://localhost:${config.port}/`);
        });
    } catch (err) {
        console.log('Failed to start', err)
        process.exit(1);
    }
}

start();
