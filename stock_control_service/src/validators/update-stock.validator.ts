import { body } from 'express-validator';

export const updateStockValidator = [
    body('shopId').optional().isInt({ gt: 0 }).withMessage('shopId должен быть положительным целым числом'),

    body('productId').optional().isInt({ gt: 0 }).withMessage('productId должен быть положительным целым числом'),

    body('quantityOnShelf').optional().isInt({ min: 0 }).withMessage('quantityOnShelf должен быть целым числом >= 0'),

    body('quantityInOrder').optional().isInt({ min: 0 }).withMessage('quantityInOrder должен быть целым числом >= 0')
];