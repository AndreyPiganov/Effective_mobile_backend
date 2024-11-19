import { body } from 'express-validator';

export const updateShopValidator = [
    body('name')
        .optional()
        .isString()
        .withMessage('name должен быть строкой')
        .notEmpty()
        .withMessage('name не может быть пустым'),

    body('location').optional().isString().withMessage('location должен быть строкой')
];
