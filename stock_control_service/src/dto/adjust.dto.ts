/**
 * @openapi
 * components:
 *   schemas:
 *     AdjustStockDto:
 *       type: object
 *       required:
 *         - productId
 *         - shopId
 *       properties:
 *         productId:
 *           type: integer
 *           description: Идентификатор продукта, для которого нужно изменить остаток
 *         shopId:
 *           type: integer
 *           description: Идентификатор магазина, для которого нужно изменить остаток
 *         quantityOnShelf:
 *           type: integer
 *           description: Количество товара на полке (необязательное поле)
 *         quantityInOrder:
 *           type: integer
 *           description: Количество товара в заказах (необязательное поле)
 */
export interface AdjustStockDto {
    /**
     * Идентификатор продукта
     * @type {number}
     */
    productId: number;

    /**
     * Идентификатор магазина
     * @type {number}
     */
    shopId: number;

    /**
     * Количество товара на полке (необязательное поле)
     * @type {number}
     */
    quantityOnShelf?: number;

    /**
     * Количество товара в заказах (необязательное поле)
     * @type {number}
     */
    quantityInOrder?: number;
}
