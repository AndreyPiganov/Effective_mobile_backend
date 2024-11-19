import supertest from 'supertest';
import { stockService } from '../../src/services/stock.service';
import { Stock } from '@prisma/client';
import createServer from '../../src/utils/server';

const baseUrl = '/api/v1/stocks';
const app = createServer();

describe('StockController Integration Tests', () => {
    const adjustDto = { productId: 1, shopId: 1, quantity: 30 };
    const adjustResponse = { success: true, newQuantityOnShelf: 70 };

    afterEach(() => {
        jest.clearAllMocks(); // очищаем моки после каждого теста
    });

    it('GET /stocks - should return all stocks', async () => {
        const mockStocks = [
            {
                id: 1,
                productId: 1,
                shopId: 2,
                quantityOnShelf: 100,
                quantityInOrder: 50,
                product: { name: 'Product', plu: '12355', id: 1 },
                shop: { name: 'Shop', id: 2, location: null }
            },
            {
                id: 2,
                productId: 2,
                shopId: 1,
                quantityOnShelf: 200,
                quantityInOrder: 30,
                product: { name: 'Product 3', plu: '12355456', id: 2 },
                shop: { name: 'Shop 2', id: 1, location: null }
            }
        ];
        const getStocksMock = jest.spyOn(stockService, 'getStocks').mockResolvedValue(mockStocks);

        const { statusCode, body } = await supertest(app).get(baseUrl);

        expect(statusCode).toBe(200);
        expect(body).toEqual(mockStocks);
        expect(getStocksMock).toHaveBeenCalledTimes(1);
    });

    it('GET /stocks/:id - should return stock by ID', async () => {
        const mockStock: Stock = {
            id: 1,
            productId: 1,
            shopId: 1,
            quantityOnShelf: 100,
            quantityInOrder: 50
        };

        const getStockByIdMock = jest.spyOn(stockService, 'getStockById').mockResolvedValue(mockStock);

        const { statusCode, body } = await supertest(app).get(`${baseUrl}/1`);

        expect(statusCode).toBe(200);
        expect(body).toEqual(mockStock);
        expect(getStockByIdMock).toHaveBeenCalledWith(1);
    });

    it('GET /stocks/:id - should return 400 if stock not found', async () => {
        const stockId = 'stock-1234';

        await supertest(app).get(`${baseUrl}/${stockId}`).expect(400);
    });

    it('POST /stocks - should create a new stock', async () => {
        const newStock = {
            productId: 1,
            shopId: 1,
            quantityOnShelf: 100,
            quantityInOrder: 50
        };
        const createdStock: Stock = { id: 1, ...newStock };

        const createStockMock = jest.spyOn(stockService, 'createStock').mockResolvedValue(createdStock);

        const { statusCode, body } = await supertest(app).post(baseUrl).send(newStock);

        expect(statusCode).toBe(201);
        expect(body).toEqual(createdStock);
        expect(createStockMock).toHaveBeenCalledWith(newStock);
    });

    it('POST /stocks - should return 400 if validation fails', async () => {
        const invalidStock = { shopId: 1, quantityOnShelf: 100 };

        const { statusCode, body } = await supertest(app).post(baseUrl).send(invalidStock);

        expect(statusCode).toBe(400);
        expect(body.errors).toBeDefined();
    });

    it('PUT /stocks/:id - should update a stock', async () => {
        const stockUpdate = { quantityOnShelf: 150, quantityInOrder: 60 };
        const updatedStock: Stock = {
            id: 1,
            productId: 1,
            shopId: 1,
            ...stockUpdate
        };

        const updateStockMock = jest.spyOn(stockService, 'updateStock').mockResolvedValue(updatedStock);

        const { statusCode, body } = await supertest(app).put(`${baseUrl}/1`).send(stockUpdate);

        expect(statusCode).toBe(200);
        expect(body).toEqual(updatedStock);
        expect(updateStockMock).toHaveBeenCalledWith(1, stockUpdate);
    });

    it('DELETE /stocks/:id - should delete a stock', async () => {
        const deleteStockResponse = { success: true };

        const deleteStockMock = jest.spyOn(stockService, 'deleteStock').mockResolvedValue(deleteStockResponse);

        const { statusCode, body } = await supertest(app).delete(`${baseUrl}/1`);

        expect(statusCode).toBe(200);
        expect(body).toEqual(deleteStockResponse);
        expect(deleteStockMock).toHaveBeenCalledWith(1);
    });

    it('DELETE /stocks/:id - should return 400 if stock not found', async () => {
        const stockId = 'stock-12325';

        await supertest(app).delete(`${baseUrl}/${stockId}`).expect(400);
    });

    it('PUT /stocks/increase - should increase stock quantity', async () => {
        const increaseStockMock = jest.spyOn(stockService, 'increaseStock').mockResolvedValue(adjustResponse);

        const { statusCode, body } = await supertest(app).put(`${baseUrl}/increase`).send(adjustDto);

        expect(statusCode).toBe(200);
        expect(body).toEqual(adjustResponse);
        expect(increaseStockMock).toHaveBeenCalledWith(adjustDto);
    });

    it('PUT /stocks/decrease - should decrease stock quantity', async () => {
        const decreaseStockMock = jest.spyOn(stockService, 'decreaseStock').mockResolvedValue(adjustResponse);

        const { statusCode, body } = await supertest(app).put(`${baseUrl}/decrease`).send(adjustDto);

        expect(statusCode).toBe(200);
        expect(body).toEqual(adjustResponse);
        expect(decreaseStockMock).toHaveBeenCalledWith(adjustDto);
    });
});
