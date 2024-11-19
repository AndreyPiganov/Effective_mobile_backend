import { param } from 'express-validator';

export const validateIdParam = param('id')
    .toInt()
    .isInt({ gt: 0 })
    .withMessage('ID должен быть положительным целым числом');
