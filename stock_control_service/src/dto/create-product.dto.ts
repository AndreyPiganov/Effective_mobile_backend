/**
 * @openapi
 * components:
 *   schemas:
 *     CreateProductDto:
 *       type: object
 *       required:
 *         - plu
 *         - name
 *       properties:
 *         plu:
 *           type: string
 *           description: Уникальный артикул товара (PLU).
 *         name:
 *           type: string
 *           description: Название товара.
 */
export interface CreateProductDto {
    /**
     * Уникальный артикул товара
     * @type {string}
     */
    plu: string;

    /**
     * Название товара
     * @type {string}
     */
    name: string;
}
