import express from 'express';
import productRouter from './product.routes';
import stockRouter from './stock.routes';
import shopRouter from './shop.routes';

const mainRouter = express.Router();

/**
 * @swagger
 * servers:
 *   - url: /api/v1
 *     description: Основной сервер
 */

mainRouter.use('/products', productRouter);
mainRouter.use('/stocks', stockRouter);
mainRouter.use('/shops', shopRouter);

export default mainRouter;
