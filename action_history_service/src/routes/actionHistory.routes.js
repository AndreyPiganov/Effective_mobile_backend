import { Router } from 'express';
import { actionHistoryController } from '../controllers/actionHistory.controller.js';
import { validateIdParam } from '../validators/id.validator.js';
import { createActionValidator } from '../validators/actions.validator.js';
import { filterValidator } from '../validators/filter.validator.js';

const router = Router();

/**
 * @swagger
 * /actions:
 *   get:
 *     summary: Получить историю действий
 *     description: Получить историю действий
 *     parameters:
 *       - $ref: '#/components/parameters/ShopIdQueryParam'
 *       - $ref: '#/components/parameters/ActionPluQuery'
 *       - $ref: '#/components/parameters/ActionTypeQueryParam'
 *       - $ref: '#/components/parameters/DateRange'
 *       - $ref: '#/components/parameters/PaginationPage'
 *       - $ref: '#/components/parameters/PaginationItemsPerPage'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/ActionList'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/', [...filterValidator], actionHistoryController.getActions);

/**
 * @swagger
 * /actions/{id}:
 *   get:
 *     summary: Получить действие по ID
 *     description: Получить действие по уникальному ID
 *     parameters:
 *       - $ref: '#/components/parameters/ActionIdParam'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/ActionFound'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         description: Действие не найдено
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/:id', [validateIdParam], actionHistoryController.getActionById);

/**
 * @swagger
 * /actions:
 *   post:
 *     summary: Создать новое действие
 *     description: Создать новое действие с товаром
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateActionHistory'
 *     responses:
 *       201:
 *         $ref: '#/components/responses/ActionCreated'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post('/', [...createActionValidator], actionHistoryController.createAction);

export default router;
