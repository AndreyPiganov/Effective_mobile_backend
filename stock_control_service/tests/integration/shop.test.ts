import supertest from 'supertest';
import { shopService } from '../../src/services/shop.service';
import { Shop } from '@prisma/client';
import createServer from '../../src/utils/server';

const baseUrl = '/api/v1/shops';
const app = createServer();

describe('ShopController Integration Tests', () => {
    afterEach(() => {
        jest.clearAllMocks(); // очищаем моки после каждого теста
    });

    it('GET /shops - should return all shops', async () => {
        const mockShops = [
            {
                id: 1,
                name: 'Shop 1',
                location: 'Location 1',
                stocks: []
            },
            {
                id: 2,
                name: 'Shop 2',
                location: 'Location 2',
                stocks: []
            }
        ];

        const getAllShopsMock = jest.spyOn(shopService, 'getAllShops').mockResolvedValue(mockShops);

        const { statusCode, body } = await supertest(app).get(baseUrl);

        expect(statusCode).toBe(200);
        expect(body).toEqual(mockShops);
        expect(getAllShopsMock).toHaveBeenCalledTimes(1);
    });

    it('GET /shops/:id - should return shop by ID', async () => {
        const mockShop: Shop = {
            id: 1,
            name: 'Shop 1',
            location: 'Location 1'
        };

        const getShopByIdMock = jest.spyOn(shopService, 'getShopById').mockResolvedValue(mockShop);

        const { statusCode, body } = await supertest(app).get(`${baseUrl}/1`);

        expect(statusCode).toBe(200);
        expect(body).toEqual(mockShop);
        expect(getShopByIdMock).toHaveBeenCalledWith(1);
    });

    it('GET /shops/:id - should return 400 if shop not found', async () => {
        const shopId = 'shop-999';

        const { statusCode } = await supertest(app).get(`${baseUrl}/${shopId}`);

        expect(statusCode).toBe(400);
    });

    it('POST /shops - should create a new shop', async () => {
        const newShop = {
            name: 'New Shop',
            location: 'New Location'
        };
        const createdShop: Shop = { id: 1, ...newShop };

        const createShopMock = jest.spyOn(shopService, 'createShop').mockResolvedValue(createdShop);

        const { statusCode, body } = await supertest(app).post(baseUrl).send(newShop);

        expect(statusCode).toBe(201);
        expect(body).toEqual(createdShop);
        expect(createShopMock).toHaveBeenCalledWith(newShop);
    });

    it('POST /shops - should return 400 if validation fails', async () => {
        const invalidShop = { name: 1 };

        const { statusCode, body } = await supertest(app).post(baseUrl).send(invalidShop);

        expect(statusCode).toBe(400);
        expect(body.errors).toBeDefined();
    });

    it('PUT /shops/:id - should update a shop', async () => {
        const shopUpdate = { name: 'Updated Shop', location: 'Updated Location' };
        const updatedShop: Shop = {
            id: 1,
            ...shopUpdate
        };

        const updateShopMock = jest.spyOn(shopService, 'updateShop').mockResolvedValue(updatedShop);

        const { statusCode, body } = await supertest(app).put(`${baseUrl}/1`).send(shopUpdate);

        expect(statusCode).toBe(200);
        expect(body).toEqual(updatedShop);
        expect(updateShopMock).toHaveBeenCalledWith(1, shopUpdate);
    });

    it('DELETE /shops/:id - should delete a shop', async () => {
        const deleteShopResponse = { success: true };

        const deleteShopMock = jest.spyOn(shopService, 'deleteShop').mockResolvedValue(deleteShopResponse);

        const { statusCode, body } = await supertest(app).delete(`${baseUrl}/1`);

        expect(statusCode).toBe(200);
        expect(body).toEqual(deleteShopResponse);
        expect(deleteShopMock).toHaveBeenCalledWith(1);
    });

    it('DELETE /shops/:id - should return 400 if shop not found', async () => {
        const shopId = 'shop-999';

        const { statusCode } = await supertest(app).delete(`${baseUrl}/${shopId}`);

        expect(statusCode).toBe(400);
    });
});
