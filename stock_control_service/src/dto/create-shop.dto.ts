/**
 * @openapi
 * components:
 *   schemas:
 *     CreateShopDto:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           description: Название магазина.
 *         location:
 *           type: string
 *           description: Местоположение магазина.
 */
export interface CreateShopDto {
    /**
     * Название магазина
     * @type {string}
     */
    name: string;

    /**
     * Местоположение магазина (необязательно)
     * @type {string}
     */
    location?: string;
}
