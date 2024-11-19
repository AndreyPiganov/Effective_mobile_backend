import dotenv from 'dotenv';
import logger from './config/logger';
import createServer from './utils/server';
import { rabbitMQService } from './services/rabbitMQ.service';

dotenv.config();

rabbitMQService
    .connect()
    .then(() => {
        logger.info('RabbitMQ is ready');
    })
    .catch((err) => {
        logger.error('Failed to initialize RabbitMQ:', err);
        process.exit(1);
    });

const app = createServer();

const PORT = process.env.PORT || 5004;

app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
});

export { app };
