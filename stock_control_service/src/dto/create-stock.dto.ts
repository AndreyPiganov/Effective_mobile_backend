/**
 * @openapi
 * components:
 *   schemas:
 *     CreateStockDto:
 *       type: object
 *       required:
 *         - shopId
 *         - productId
 *         - quantityOnShelf
 *         - quantityInOrder
 *       properties:
 *         shopId:
 *           type: integer
 *           description: Идентификатор магазина, в котором находится товар.
 *         productId:
 *           type: integer
 *           description: Идентификатор товара.
 *         quantityOnShelf:
 *           type: integer
 *           description: Количество товара на полке магазина.
 *         quantityInOrder:
 *           type: integer
 *           description: Количество товара в заказах магазина.
 */
export interface CreateStockDto {
    /**
     * Идентификатор магазина, в котором находится товар
     * @type {number}
     */
    shopId: number;

    /**
     * Идентификатор товара
     * @type {number}
     */
    productId: number;

    /**
     * Количество товара на полке магазина
     * @type {number}
     */
    quantityOnShelf: number;

    /**
     * Количество товара в заказах магазина
     * @type {number}
     */
    quantityInOrder: number;
}
