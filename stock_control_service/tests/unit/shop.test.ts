import { prismaMock } from '../singleton';
import { ShopService } from '../../src/services/shop.service';
import logger from '../../src/config/logger';

jest.mock('../../src/config/logger', () => ({
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn()
}));

describe('ShopService', () => {
    let shopService: ShopService;

    beforeEach(() => {
        shopService = new ShopService(prismaMock, logger);
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.resetModules();
    });

    describe('getAllShops', () => {
        it('should return a list of shops', async () => {
            const mockShops = [
                { id: 1, name: 'Shop 1', location: 'Location 1' },
                { id: 2, name: 'Shop 2', location: 'Location 2' }
            ];

            prismaMock.shop.findMany.mockResolvedValue(mockShops);

            const result = await shopService.getAllShops();

            expect(result).toEqual(mockShops);
            expect(prismaMock.shop.findMany).toHaveBeenCalledWith({ take: 100 });
        });

        it('should log and rethrow errors', async () => {
            prismaMock.shop.findMany.mockRejectedValue(new Error('Database error'));

            await expect(shopService.getAllShops()).rejects.toThrow('Could not get shops');
        });
    });

    describe('getShopById', () => {
        it('should return the shop for a valid ID', async () => {
            const mockShop = { id: 1, name: 'Shop 1', location: 'Location 1' };

            prismaMock.shop.findFirst.mockResolvedValue(mockShop);

            const result = await shopService.getShopById(1);

            expect(result).toEqual(mockShop);
            expect(prismaMock.shop.findFirst).toHaveBeenCalledWith({ where: { id: 1 } });
        });

        it('should throw NotFoundException for an invalid ID', async () => {
            prismaMock.shop.findFirst.mockResolvedValue(null);

            await expect(shopService.getShopById(1)).rejects.toThrow('По данному id 1 не найдено товара');
        });

        it('should log and rethrow errors', async () => {
            prismaMock.shop.findFirst.mockRejectedValue(new Error('Database error'));

            await expect(shopService.getShopById(1)).rejects.toThrow('Database error');
        });
    });

    describe('createShop', () => {
        it('should create and return a new shop', async () => {
            const dto = { name: 'New Shop', location: 'New Location' };
            const mockShop = { id: 1, ...dto };

            prismaMock.shop.create.mockResolvedValue(mockShop);

            const result = await shopService.createShop(dto);

            expect(result).toEqual(mockShop);
            expect(prismaMock.shop.create).toHaveBeenCalledWith({ data: { ...dto } });
        });

        it('should log and rethrow errors', async () => {
            const dto = { name: 'New Shop', location: 'New Location' };

            prismaMock.shop.create.mockRejectedValue(new Error('Database error'));

            await expect(shopService.createShop(dto)).rejects.toThrow('Could not create shop');
        });
    });

    describe('updateShop', () => {
        it('should update and return the shop', async () => {
            const id = 1;
            const dto = { name: 'Updated Shop' };
            const mockShop = { id, name: 'Old Shop', location: 'Old Location' };
            const updatedShop = { ...mockShop, ...dto };

            prismaMock.shop.findFirst.mockResolvedValue(mockShop);
            prismaMock.shop.update.mockResolvedValue(updatedShop);

            const result = await shopService.updateShop(id, dto);

            expect(result).toEqual(updatedShop);
            expect(prismaMock.shop.update).toHaveBeenCalledWith({ where: { id }, data: { ...dto } });
        });

        it('should throw NotFoundException if the shop does not exist', async () => {
            prismaMock.shop.findFirst.mockResolvedValue(null);

            await expect(shopService.updateShop(1, {})).rejects.toThrow('С данным id не найдено магазина');
        });

        it('should log and rethrow errors', async () => {
            prismaMock.shop.findFirst.mockResolvedValue({ id: 1, name: 'Shop', location: 'Location' });
            prismaMock.shop.update.mockRejectedValue(new Error('Database error'));

            await expect(shopService.updateShop(1, {})).rejects.toThrow('Database error');
        });
    });

    describe('deleteShop', () => {
        it('should delete the shop and return success', async () => {
            const mockShop = { id: 1, name: 'Shop', location: 'Location' };

            prismaMock.shop.findUnique.mockResolvedValue(mockShop);
            prismaMock.shop.delete.mockResolvedValue(mockShop);

            const result = await shopService.deleteShop(1);

            expect(result).toEqual({ success: true });
            expect(prismaMock.shop.delete).toHaveBeenCalledWith({ where: { id: 1 } });
        });

        it('should throw NotFoundException if the shop does not exist', async () => {
            prismaMock.shop.findUnique.mockResolvedValue(null);

            await expect(shopService.deleteShop(1)).rejects.toThrow('Магазин по данному id 1 не найден');
        });

        it('should log and rethrow errors', async () => {
            prismaMock.shop.findUnique.mockResolvedValue({ id: 1, name: 'Shop', location: 'Location' });
            prismaMock.shop.delete.mockRejectedValue(new Error('Database error'));

            await expect(shopService.deleteShop(1)).rejects.toThrow('Database error');
        });
    });
});
