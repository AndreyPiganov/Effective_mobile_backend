/**
 * @swagger
 * components:
 *   schemas:
 *     ActionHistory:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: Уникальный идентификатор действия.
 *         action:
 *           type: string
 *           enum: [CREATE_STOCK, UPDATE_STOCK, DELETE_STOCK, INCREASE_STOCK, DECREASE_STOCK, CREATE_PRODUCT, UPDATE_PRODUCT, DELETE_PRODUCT]
 *           description: Тип действия.
 *         shopId:
 *           type: integer
 *           description: ID магазина, связанного с действием.
 *         plu:
 *           type: string
 *           description: PLU товара.
 *         timestamp:
 *           type: string
 *           format: date-time
 *           description: Время выполнения действия.

 *     CreateActionHistory:
 *       type: object
 *       required:
 *         - action
 *         - shopId
 *         - plu
 *       properties:
 *         action:
 *           type: string
 *           enum: [CREATE_STOCK, UPDATE_STOCK, DELETE_STOCK, INCREASE_STOCK, DECREASE_STOCK, CREATE PRODUCT, UPDATE_PRODUCT, DELETE_PRODUCT]
 *           description: Тип действия.
 *         shopId:
 *           type: integer
 *           description: ID магазина, связанного с действием.
 *         plu:
 *           type: string
 *           description: PLU товара.
 *
 */
