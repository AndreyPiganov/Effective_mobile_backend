import { body } from 'express-validator';

export const createShopValidator = [
    body('name').isString().withMessage('name должен быть строкой').notEmpty().withMessage('name обязателен'),

    body('location').optional().isString().withMessage('location должен быть строкой')
];
