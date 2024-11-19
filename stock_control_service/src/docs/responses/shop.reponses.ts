/**
 * @openapi
 * components:
 *   responses:
 *     ShopFound:
 *       description: Магазин найден
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Shop'
 *     ShopList:
 *       description: Список магазинов
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/Shop'
 *     ShopCreated:
 *       description: Магазин создан успешно
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Shop'
 *     ShopUpdated:
 *       description: Магазин обновлен успешно
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Shop'
 *     ShopDeleted:
 *       description: Магазин успешно удален
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 description: Сообщение об успешном удалении
 *                 example: "Shop deleted successfully"
 */
