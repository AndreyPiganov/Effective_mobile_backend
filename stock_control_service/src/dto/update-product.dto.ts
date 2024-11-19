import { CreateProductDto } from './create-product.dto';

/**
 * @openapi
 * components:
 *   schemas:
 *     UpdateProductDto:
 *       type: object
 *       properties:
 *         plu:
 *           type: string
 *           description: Артикул товара. Этот параметр может быть обновлен.
 *         name:
 *           type: string
 *           description: Название товара. Этот параметр может быть обновлен.
 */
export interface UpdateProductDto extends Partial<CreateProductDto> {}
