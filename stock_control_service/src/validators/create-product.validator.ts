import { body } from 'express-validator';

export const createProductValidator = [
    body('plu').isString().withMessage('PLU должен быть строкой').notEmpty().withMessage('PLU обязателен'),

    body('name').isString().withMessage('Name должен быть строкой').notEmpty().withMessage('Name обязателен')
];
