import express from 'express';
import actionRouter from './actionHistory.routes.js';

const mainRouter = express.Router();

mainRouter.use('/actions', actionRouter);

/**
 * @swagger
 * servers:
 *   - url: /api/v1
 *     description: Основной сервер
 */

export default mainRouter;
