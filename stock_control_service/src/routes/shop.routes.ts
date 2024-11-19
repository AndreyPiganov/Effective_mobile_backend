import { Router } from 'express';
import { shopController } from '../controllers/shop.controller';
import { createShopValidator } from '../validators/create-shop.validator';
import { validateIdParam } from '../validators/id.validator';
import { updateShopValidator } from '../validators/update-shop.validator';

const router = Router();

/**
 * @swagger
 * /shops:
 *   get:
 *     summary: Получить список всех магазинов
 *     tags:
 *       - Shops
 *     responses:
 *       200:
 *         $ref: '#/components/responses/ShopList'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/', shopController.getAllShops);

/**
 * @swagger
 * /shops/{id}:
 *   get:
 *     summary: Получить магазин по ID
 *     tags:
 *       - Shops
 *     parameters:
 *       - $ref: '#/components/parameters/ShopIdParam'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/ShopFound'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/:id', [validateIdParam], shopController.getShopById);

/**
 * @swagger
 * /shops:
 *   post:
 *     summary: Создать новый магазин
 *     tags:
 *       - Shops
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateShopDto'
 *     responses:
 *       201:
 *         $ref: '#/components/responses/ShopCreated'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post('/', [...createShopValidator], shopController.createShop);

/**
 * @swagger
 * /shops/{id}:
 *   put:
 *     summary: Обновить данные магазина
 *     tags:
 *       - Shops
 *     parameters:
 *       - $ref: '#/components/parameters/ShopIdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateShopDto'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/ShopUpdated'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.put('/:id', [...updateShopValidator, validateIdParam], shopController.updateShop);

/**
 * @swagger
 * /shops/{id}:
 *   delete:
 *     summary: Удалить магазин
 *     tags:
 *       - Shops
 *     parameters:
 *       - $ref: '#/components/parameters/ShopIdParam'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/ShopDeleted'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.delete('/:id', [validateIdParam], shopController.deleteShop);

export default router;
