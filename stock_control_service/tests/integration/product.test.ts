import supertest from 'supertest';
import { productService } from '../../src/services/product.service';
import { Product } from '@prisma/client';
import createServer from '../../src/utils/server';

const baseUrl = '/api/v1/products';
const app = createServer();

describe('ProductController Integration Tests', () => {
    afterEach(() => {
        jest.clearAllMocks(); // очищаем моки после каждого теста
    });

    it('GET /products - should return all products', async () => {
        const mockProducts = [
            {
                id: 1,
                name: 'Product 1',
                plu: '12355'
            },
            {
                id: 2,
                name: 'Product 2',
                plu: '12355456'
            }
        ];

        const getProductsMock = jest.spyOn(productService, 'getProducts').mockResolvedValue(mockProducts);

        const { statusCode, body } = await supertest(app).get(baseUrl);

        expect(statusCode).toBe(200);
        expect(body).toEqual(mockProducts);
        expect(getProductsMock).toHaveBeenCalledTimes(1);
    });

    it('GET /products/:id - should return product by ID', async () => {
        const mockProduct: Product = {
            id: 1,
            name: 'Product 1',
            plu: '12355'
        };

        const getProductByIdMock = jest.spyOn(productService, 'getProductById').mockResolvedValue(mockProduct);

        const { statusCode, body } = await supertest(app).get(`${baseUrl}/1`);

        expect(statusCode).toBe(200);
        expect(body).toEqual(mockProduct);
        expect(getProductByIdMock).toHaveBeenCalledWith(1);
    });

    it('GET /products/:id - should return 404 if product not found', async () => {
        const productId = 'product-1234';

        await supertest(app).get(`${baseUrl}/${productId}`).expect(400);
    });

    it('POST /products - should create a new product', async () => {
        const newProduct = {
            name: 'New Product',
            plu: '123456789'
        };
        const createdProduct: Product = { id: 1, ...newProduct };

        const createProductMock = jest.spyOn(productService, 'createProduct').mockResolvedValue(createdProduct);

        const { statusCode, body } = await supertest(app).post(baseUrl).send(newProduct);

        expect(statusCode).toBe(201);
        expect(body).toEqual(createdProduct);
        expect(createProductMock).toHaveBeenCalledWith(newProduct);
    });

    it('POST /products - should return 400 if validation fails', async () => {
        const invalidProduct = { name: 'Product' }; // Пример недостающих данных

        const { statusCode, body } = await supertest(app).post(baseUrl).send(invalidProduct);

        expect(statusCode).toBe(400);
        expect(body.errors).toBeDefined();
    });

    it('PUT /products/:id - should update a product', async () => {
        const productUpdate = { name: 'Updated Product' };
        const updatedProduct: Product = {
            id: 1,
            plu: '12355',
            ...productUpdate
        };

        const updateProductMock = jest.spyOn(productService, 'updateProduct').mockResolvedValue(updatedProduct);

        const { statusCode, body } = await supertest(app).put(`${baseUrl}/1`).send(productUpdate);

        expect(statusCode).toBe(200);
        expect(body).toEqual(updatedProduct);
        expect(updateProductMock).toHaveBeenCalledWith(1, productUpdate);
    });

    it('DELETE /products/:id - should delete a product', async () => {
        const deleteProductResponse = { success: true };

        const deleteProductMock = jest.spyOn(productService, 'deleteProduct').mockResolvedValue(deleteProductResponse);

        const { statusCode, body } = await supertest(app).delete(`${baseUrl}/1`);

        expect(statusCode).toBe(200);
        expect(body).toEqual(deleteProductResponse);
        expect(deleteProductMock).toHaveBeenCalledWith(1);
    });

    it('DELETE /products/:id - should return 404 if product not found', async () => {
        const productId = 'product-12325';

        await supertest(app).delete(`${baseUrl}/${productId}`).expect(400);
    });
});
