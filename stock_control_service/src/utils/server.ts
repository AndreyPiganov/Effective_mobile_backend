import express from 'express';
import { errorHandler } from '../middlewares/errorHandler';
import mainRouter from '../routes';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerOptions from '../docs/swagger';
import swaggerUi from 'swagger-ui-express';
import cors from 'cors';

function createServer() {
    const app = express();
    const swaggerSpec = swaggerJSDoc(swaggerOptions);

    app.use(express.json());
    app.use(
        cors({
            origin: false,
            credentials: true
        })
    );
    app.use(express.urlencoded({ extended: true }));

    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    app.use('/api/v1', mainRouter);

    app.use(errorHandler);

    return app;
}

export default createServer;
