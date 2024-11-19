/**
 * @swagger
 * components:
 *   parameters:
 *     StockIdParam:
 *       name: id
 *       in: path
 *       required: true
 *       description: Уникальный идентификатор остатка
 *       schema:
 *         type: integer
 *     ShopIdQuery:
 *       name: shopId
 *       in: query
 *       description: ID магазина для фильтрации
 *       schema:
 *         type: integer
 *     PluQuery:
 *       name: plu
 *       in: query
 *       description: PLU товара для фильтрации
 *       schema:
 *         type: string
 *     QuantityOnShelfQuery:
 *       name: quantityOnShelf
 *       in: query
 *       description: Фильтр по количеству на полке
 *       schema:
 *         type: string
 *     QuantityInOrderQuery:
 *       name: quantityInOrder
 *       in: query
 *       description: Фильтр по количеству в заказе
 *       schema:
 *         type: string
 */
