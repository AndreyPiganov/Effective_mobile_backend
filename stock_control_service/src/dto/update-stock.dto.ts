import { CreateStockDto } from './create-stock.dto';

/**
 * @openapi
 * components:
 *   schemas:
 *     UpdateStockDto:
 *       type: object
 *       properties:
 *         shopId:
 *           type: integer
 *           description: Идентификатор магазина, для которого обновляются данные о товаре.
 *         productId:
 *           type: integer
 *           description: Идентификатор товара, для которого обновляются данные о остатках.
 *         quantityOnShelf:
 *           type: integer
 *           description: Количество товара на полке. Этот параметр может быть обновлен.
 *         quantityInOrder:
 *           type: integer
 *           description: Количество товара в заказе. Этот параметр может быть обновлен.
 */
export interface UpdateStockDto extends Partial<CreateStockDto> {}
