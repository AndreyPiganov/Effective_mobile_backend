import { HttpException } from './HttpException.js';

/**
 * @openapi
 * components:
 *   responses:
 *     NotFound:
 *       description: Ресурс не найден
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               statusCode:
 *                 type: integer
 *                 example: 404
 *               message:
 *                 type: string
 *                 example: "Resource not found"
 *               stack:
 *                 type: string
 *                 example: "Error\n"
 */
export class NotFoundException extends HttpException {
    constructor(message = 'Not Found') {
        super(message, 404);
    }
}
