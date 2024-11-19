import { body } from 'express-validator';

export const adjustStockValidator = [
    body('productId')
        .notEmpty()
        .withMessage('Product ID is required')
        .isInt()
        .withMessage('Product ID must be an integer'),

    body('shopId').notEmpty().withMessage('Shop ID is required').isInt().withMessage('Shop ID must be an integer'),

    body('quantityOnShelf').optional().isInt().withMessage('Quantity on shelf must be an integer'),

    body('quantityInOrder').optional().isInt().withMessage('Quantity in order must be an integer')
];
