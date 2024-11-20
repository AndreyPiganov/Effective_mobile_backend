import { Router } from 'express';
import { stockController } from '../controllers/stock.controller';
import { adjustStockValidator } from '../validators/adjust.validator';
import { createStockValidator } from '../validators/create-stock.validator';
import { validateStockFilters } from '../validators/filter-params.validator';
import { validateIdParam } from '../validators/id.validator';
import { updateStockValidator } from '../validators/update-stock.validator';

const router = Router();

/**
 * @swagger
 * /stocks:
 *   get:
 *     summary: Получить остатки
 *     tags:
 *       - Stocks
 *     parameters:
 *       - $ref: '#/components/parameters/ShopIdQuery'
 *       - $ref: '#/components/parameters/PluQuery'
 *       - $ref: '#/components/parameters/QuantityOnShelfQuery'
 *       - $ref: '#/components/parameters/QuantityInOrderQuery'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/StockList'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/', [...validateStockFilters], stockController.getStocks);

/**
 * @swagger
 * /stocks/{id}:
 *   get:
 *     summary: Получить остаток по ID
 *     tags:
 *       - Stocks
 *     parameters:
 *       - $ref: '#/components/parameters/StockIdParam'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/StockFound'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/:id', [validateIdParam], stockController.getStockById);

/**
 * @swagger
 * /stocks:
 *   post:
 *     summary: Создать новый остаток
 *     tags:
 *       - Stocks
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateStockDto'
 *     responses:
 *       201:
 *         $ref: '#/components/responses/StockCreated'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post('/', [...createStockValidator], stockController.createStock);

/**
 * @swagger
 * /stocks/increase:
 *   put:
 *     summary: Увеличить остаток
 *     tags:
 *       - Stocks
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AdjustStockDto'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/StockUpdated'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.put('/increase', [...adjustStockValidator], stockController.increaseStock);

/**
 * @swagger
 * /stocks/decrease:
 *   put:
 *     summary: Уменьшить остаток
 *     tags:
 *       - Stocks
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AdjustStockDto'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/StockUpdated'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.put('/decrease', [...adjustStockValidator], stockController.decreaseStock);

/**
 * @swagger
 * /stocks/{id}:
 *   put:
 *     summary: Обновить остаток
 *     tags:
 *       - Stocks
 *     parameters:
 *       - $ref: '#/components/parameters/StockIdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateStockDto'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/StockUpdated'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.put('/:id', [...updateStockValidator, validateIdParam], stockController.updateStock);

/**
 * @swagger
 * /stocks/{id}:
 *   delete:
 *     summary: Удалить остаток
 *     tags:
 *       - Stocks
 *     parameters:
 *       - $ref: '#/components/parameters/StockIdParam'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/StockDeleted'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.delete('/:id', [validateIdParam], stockController.deleteStock);

export default router;
