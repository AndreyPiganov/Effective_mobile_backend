import { body } from 'express-validator';

export const updateProductValidator = [
    body('plu').optional().isString().withMessage('PLU должен быть строкой'),

    body('name').optional().isString().withMessage('Name должен быть строкой')
];
