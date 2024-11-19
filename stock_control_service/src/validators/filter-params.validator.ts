import { query } from 'express-validator';

export const validateStockFilters = [
    query('shopId').optional().toInt().isInt({ gt: 0 }).withMessage('Shop ID must be a positive integer'),

    query('plu').optional().isString().withMessage('PLU must be a string'),

    query('quantityOnShelf')
        .optional()
        .matches(/^\d+(,\d+)?$/)
        .withMessage('Quantity on shelf must be a number or a range in the format "min,max"'),

    query('quantityInOrder')
        .optional()
        .matches(/^\d+(,\d+)?$/)
        .withMessage('Quantity in order must be a number or a range in the format "min,max"')
];

export const validateProductFilters = [
    query('name')
        .optional()
        .isString()
        .custom((value, { path }) => {
            if (!isNaN(value)) {
                throw new Error(`${path} cannot be a number`);
            }
            return true;
        })
        .withMessage('Name must be a string'),

    query('plu').optional().isString().withMessage('PLU must be a string')
];
