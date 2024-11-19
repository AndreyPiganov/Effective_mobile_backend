import { body } from 'express-validator';

export const createStockValidator = [
    body('shopId').isInt({ gt: 0 }).withMessage('shopId должен быть положительным целым числом'),

    body('productId').isInt({ gt: 0 }).withMessage('productId должен быть положительным целым числом'),

    body('quantityOnShelf').isInt({ min: 0 }).withMessage('quantityOnShelf должен быть неотрицательным целым числом'),

    body('quantityInOrder').isInt({ min: 0 }).withMessage('quantityInOrder должен быть неотрицательным целым числом')
];
