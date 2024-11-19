import { body } from 'express-validator';

const VALID_ACTIONS = [
    'CREATE_STOCK',
    'UPDATE_STOCK',
    'DELETE_STOCK',
    'INCREASE_STOCK',
    'DECREASE_STOCK',
    'CREATE_PRODUCT',
    'UPDATE_PRODUCT',
    'DELETE_PRODUCT'
];

const createActionValidator = [
    body('action')
        .isString()
        .withMessage('Action must be a string')
        .isIn(VALID_ACTIONS)
        .withMessage(`Action must be one of the following: ${VALID_ACTIONS.join(', ')}`),
    body('shopId').toInt().isInt({ min: 1 }).withMessage('shopId must be a positive integer'),
    body('plu').isString().withMessage('plu must be a string').notEmpty().withMessage('plu is required'),
    body('timestamp').optional().isISO8601().withMessage('timestamp must be a valid ISO8601 date')
];

export { createActionValidator };
