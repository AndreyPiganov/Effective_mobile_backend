/**
 * @openapi
 * components:
 *   responses:
 *     ProductFound:
 *       description: Продукт найден
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     ProductList:
 *       description: Список продуктов
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/Product'
 *     ProductCreated:
 *       description: Продукт успешно создан
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     ProductUpdated:
 *       description: Продукт успешно обновлен
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     ProductDeleted:
 *       description: Продукт успешно удален
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 description: Сообщение об успешном удалении
 *                 example: "Product deleted successfully"
 */
