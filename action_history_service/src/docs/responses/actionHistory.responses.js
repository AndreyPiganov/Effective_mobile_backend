/**
 * @openapi
 * components:
 *   responses:
 *     ActionFound:
 *       description: Действие найдено
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ActionHistory'
 *     ActionList:
 *       description: Список действий
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/ActionHistory'
 *     ActionCreated:
 *       description: Действие создано успешно
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ActionHistory'
 */
