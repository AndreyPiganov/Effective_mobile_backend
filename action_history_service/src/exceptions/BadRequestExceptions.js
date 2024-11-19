import { HttpException } from './HttpException.js';

/**
 * @openapi
 * components:
 *   responses:
 *     BadRequest:
 *       description: Неверный запрос
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               statusCode:
 *                 type: integer
 *                 example: 400
 *               message:
 *                 type: string
 *                 example: "Invalid input"
 *               stack:
 *                 type: string
 *                 example: "Error\n"
 */
export class BadRequestException extends HttpException {
    constructor(message = 'Bad Request') {
        super(message, 400);
    }
}
