/**
 * @openapi
 * components:
 *   schemas:
 *     Stock:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: Уникальный идентификатор остатка
 *           example: 1
 *         productId:
 *           type: integer
 *           description: ID продукта
 *           example: 1
 *         shopId:
 *           type: integer
 *           description: ID магазина
 *           example: 2
 *         quantityOnShelf:
 *           type: integer
 *           description: Количество товара на полке
 *           example: 10
 *         quantityInOrder:
 *           type: integer
 *           description: Количество товара в заказе
 *           example: 5
 */
