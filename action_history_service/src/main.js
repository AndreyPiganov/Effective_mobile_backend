import express from 'express';
import { errorHandler } from './middlewares/errorHandler.js';
import dotenv from 'dotenv';
import mainRouter from './routes/index.js';
import logger from './config/logger.js';
import swaggerUi from 'swagger-ui-express';
import swaggerOptions from './docs/swagger.js';
import swaggerJSDoc from 'swagger-jsdoc';
import { rabbitMQConsumer } from './services/rabbitMQ.consumer.js';
import cors from 'cors';

dotenv.config();

const app = express();
const swaggerSpec = swaggerJSDoc(swaggerOptions);

rabbitMQConsumer
    .connect()
    .then(() => {
        logger.info('RabbitMQ is ready');
    })
    .catch((err) => {
        logger.error('Failed to initialize RabbitMQ:', err);
        process.exit(1);
    });

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/v1', mainRouter);

app.use(errorHandler);

const PORT = process.env.PORT || 5004;

app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
});
