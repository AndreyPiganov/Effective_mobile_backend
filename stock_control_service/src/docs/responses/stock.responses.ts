/**
 * @openapi
 * components:
 *   responses:
 *     StockFound:
 *       description: Остаток найден
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Stock'
 *     StockList:
 *       description: Список остатков
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/Stock'
 *     StockCreated:
 *       description: Остаток создан успешно
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Stock'
 *     StockUpdated:
 *       description: Остаток обновлен успешно
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Stock'
 *     StockDeleted:
 *       description: Остаток успешно удален
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               success:
 *                 type: boolean
 *                 description: Сообщение об успешном удалении
 *                 example: "true"
 */
