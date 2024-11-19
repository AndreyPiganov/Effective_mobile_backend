import { query } from 'express-validator';

export const validatePagination = [
    query('page').optional().toInt().isInt({ gt: 0 }).withMessage('Page must be a positive integer'),
    query('itemsPerPage').optional().toInt().isInt({ gt: 0 }).withMessage('Items per page must be a positive integer')
];

export const filterValidator = [
    ...validatePagination,
    query('date')
        .optional()
        .isString()
        .matches(/^(\d{4}-\d{2}-\d{2})(,\d{4}-\d{2}-\d{2})?$/)
        .withMessage('Invalid date format. Expected format: YYYY-MM-DD or YYYY-MM-DD,YYYY-MM-DD'),
    query('plu').optional().isString().withMessage('plu must be a string'),
    query('action').optional().isString().withMessage('action must be a string'),
    query('shopId').optional().toInt().isInt().withMessage('shop id must be a integer')
];
