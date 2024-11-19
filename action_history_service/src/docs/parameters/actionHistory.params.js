/**
 * @swagger
 * components:
 *   parameters:
 *     ActionIdParam:
 *       in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: integer
 *       description: Уникальный идентификатор действия.
 *     ShopIdQueryParam:
 *       in: query
 *       name: shopId
 *       schema:
 *         type: integer
 *       description: ID магазина для фильтрации.
 *     ActionTypeQueryParam:
 *       in: query
 *       name: action
 *       schema:
 *         type: string
 *         enum: [CREATE_STOCK, UPDATE_STOCK, DELETE_STOCK, INCREASE_STOCK, DECREASE_STOCK, CREATE_PRODUCT, UPDATE_PRODUCT, DELETE_PRODUCT]
 *       description: Тип действия для фильтрации.
 *     ActionPluQuery:
 *       name: plu
 *       in: query
 *       description: PLU продукта
 *       schema:
 *         type: string
 *     PaginationPage:
 *       name: page
 *       in: query
 *       description: Номер страницы для пагинации
 *       schema:
 *         type: integer
 *         example: 1
 *     PaginationItemsPerPage:
 *       name: itemsPerPage
 *       in: query
 *       description: Количество элементов на страницу
 *       schema:
 *         type: integer
 *         example: 5
 *     DateRange:
 *       name: date
 *       in: query
 *       description: Дата, через запятую можно указать диапозон
 *       schema:
 *         type: string
 *         format: date
 *         example: "2024-01-31,2024-02-31"
 */
