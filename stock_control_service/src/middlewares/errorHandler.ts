import { Request, Response, NextFunction } from 'express';
import { HttpException } from '../exceptions/HttpException';

export function errorHandler(err: HttpException, _: Request, res: Response, next: NextFunction) {
    if (!(err instanceof HttpException)) {
        return next(err);
    }

    res.status(err.statusCode).json({
        statusCode: err.statusCode,
        message: err.message,
        stack: err.stack || 'No stack available'
    });
}
