import { CreateShopDto } from './create-shop.dto';

/**
 * @openapi
 * components:
 *   schemas:
 *     UpdateShopDto:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Название магазина. Этот параметр может быть обновлен.
 *         location:
 *           type: string
 *           description: Расположение магазина. Этот параметр может быть обновлен.
 */
export interface UpdateShopDto extends Partial<CreateShopDto> {}
