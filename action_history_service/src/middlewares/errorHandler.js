import { HttpException } from '../exceptions/HttpException.js';

export function errorHandler(err, _, res, next) {
    if (!(err instanceof HttpException)) {
        return next(err);
    }

    return res.status(err.statusCode).json({
        statusCode: err.statusCode,
        message: err.message,
        stack: err.stack || 'No stack available'
    });
}
