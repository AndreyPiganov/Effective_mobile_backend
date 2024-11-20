import { Router } from 'express';
import { productController } from '../controllers/product.controller';
import { validateIdParam } from '../validators/id.validator';
import { updateProductValidator } from '../validators/update-product.validator';
import { createProductValidator } from '../validators/create-product.validator';
import { validateProductFilters } from '../validators/filter-params.validator';

const router = Router();

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Получить список продуктов
 *     tags:
 *       - Products
 *     parameters:
 *       - $ref: '#/components/parameters/ProductNameQuery'
 *       - $ref: '#/components/parameters/ProductPluQuery'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/ProductList'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/', [...validateProductFilters], productController.getProducts);

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Получить продукт по ID
 *     tags:
 *       - Products
 *     parameters:
 *       - $ref: '#/components/parameters/ProductIdParam'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/ProductFound'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/:id', [validateIdParam], productController.getProductById);

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Создать новый продукт
 *     tags:
 *       - Products
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateProductDto'
 *     responses:
 *       201:
 *         $ref: '#/components/responses/ProductCreated'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post('/', [...createProductValidator], productController.createProduct);

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Обновить продукт
 *     tags:
 *       - Products
 *     parameters:
 *       - $ref: '#/components/parameters/ProductIdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProductDto'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/ProductUpdated'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.put('/:id', [...updateProductValidator, validateIdParam], productController.updateProduct);

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Удалить продукт
 *     tags:
 *       - Products
 *     parameters:
 *       - $ref: '#/components/parameters/ProductIdParam'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/ProductDeleted'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.delete('/:id', [validateIdParam], productController.deleteProduct);

export default router;
