import { prismaMock } from '../singleton';
import { StockService } from '../../src/services/stock.service';
import logger from '../../src/config/logger';
import { RabbitMQService } from '../../src/services/rabbitMQ.service';
import { StockFilterOptions } from '../../src/controllers/filters/ifilter.options';
import { NotFoundException } from '../../src/exceptions/NotFoundExceptions';

jest.mock('../../src/services/rabbitMQ.service', () => {
    return {
        RabbitMQService: jest.fn().mockImplementation(() => ({
            publishMessage: jest.fn()
        }))
    };
});

jest.mock('../../src/config/logger', () => ({
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn()
}));

describe('StockService', () => {
    let stockService: StockService;
    let mockRabbitMQService: jest.Mocked<RabbitMQService>;

    beforeEach(() => {
        mockRabbitMQService = new (jest.requireMock('../../src/services/rabbitMQ.service').RabbitMQService)();
        stockService = new StockService(prismaMock, logger, mockRabbitMQService);
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.resetModules();
    });

    describe('getStocks', () => {
        it('should return a list of stocks', async () => {
            const mockStocks = [
                { id: 1, quantityOnShelf: 10, quantityInOrder: 5, productId: 1, shopId: 1 },
                { id: 2, quantityOnShelf: 15, quantityInOrder: 10, productId: 2, shopId: 2 }
            ];

            prismaMock.stock.findMany.mockResolvedValue(mockStocks);

            const filterOptions: StockFilterOptions = { quantityOnShelf: 10 };
            const result = await stockService.getStocks(filterOptions);

            expect(result).toEqual(mockStocks);
            expect(prismaMock.stock.findMany).toHaveBeenCalledWith({
                where: { ...filterOptions },
                include: { product: true, shop: true }
            });
        });

        it('should throw an error if fetching stocks fails', async () => {
            prismaMock.stock.findMany.mockRejectedValue(new Error('Database error'));

            await expect(stockService.getStocks({})).rejects.toThrow('Could not get stocks');
        });
    });

    describe('getStockById', () => {
        it('should return the stock for a valid ID', async () => {
            const mockStock = { id: 1, quantityOnShelf: 10, quantityInOrder: 5, productId: 1, shopId: 1 };

            prismaMock.stock.findFirst.mockResolvedValue(mockStock);

            const result = await stockService.getStockById(1);

            expect(result).toEqual(mockStock);
            expect(prismaMock.stock.findFirst).toHaveBeenCalledWith({ where: { id: 1 } });
        });

        it('should throw NotFoundException for an invalid ID', async () => {
            prismaMock.stock.findFirst.mockResolvedValue(null);

            await expect(stockService.getStockById(1)).rejects.toThrow('По данному id 1 не найдено остатка');
        });
    });

    describe('createStock', () => {
        it('should create and return a new stock', async () => {
            const dto = { quantityOnShelf: 10, quantityInOrder: 5, productId: 1, shopId: 2 };
            const mockStock = { id: 1, ...dto, product: { plu: 'Test product' } };

            prismaMock.stock.create.mockResolvedValue(mockStock);

            const result = await stockService.createStock(dto);

            expect(result).toEqual(mockStock);
            expect(prismaMock.stock.create).toHaveBeenCalledWith({
                data: {
                    quantityInOrder: dto.quantityInOrder,
                    quantityOnShelf: dto.quantityOnShelf,
                    product: { connect: { id: dto.productId } },
                    shop: { connect: { id: dto.shopId } }
                },
                include: { product: true }
            });
            expect(mockRabbitMQService.publishMessage).toHaveBeenCalledWith('events_exchange', 'stock.create', {
                action: 'CREATE_STOCK',
                shopId: dto.shopId,
                plu: mockStock.product.plu,
                metadata: { ...dto }
            });
        });

        it('should log and rethrow errors', async () => {
            const dto = { quantityOnShelf: 10, quantityInOrder: 5, productId: 1, shopId: 2 };

            prismaMock.stock.create.mockRejectedValue(new Error('Database error'));

            await expect(stockService.createStock(dto)).rejects.toThrow('Could not create stock');
        });
    });

    describe('updateStock', () => {
        it('should update and return the stock', async () => {
            const id = 1;
            const dto = { quantityOnShelf: 20 };
            const mockStock = {
                id,
                quantityOnShelf: 10,
                productId: 1,
                shopId: 1,
                quantityInOrder: 15,
                product: { plu: '123456' }
            };
            const updatedStock = { ...mockStock, ...dto };

            prismaMock.stock.findFirst.mockResolvedValue(mockStock);
            prismaMock.stock.update.mockResolvedValue(updatedStock);

            const result = await stockService.updateStock(id, dto);

            expect(result).toEqual(updatedStock);
            expect(prismaMock.stock.update).toHaveBeenCalledWith({ where: { id }, data: { ...dto } });
            expect(mockRabbitMQService.publishMessage).toHaveBeenCalledWith('events_exchange', 'stock.update', {
                action: 'UPDATE_STOCK',
                shopId: mockStock.shopId,
                plu: mockStock.product.plu,
                metadata: { ...dto }
            });
        });

        it('should throw NotFoundException if the stock does not exist', async () => {
            prismaMock.stock.findFirst.mockResolvedValue(null);

            await expect(stockService.updateStock(1, {})).rejects.toThrow('С данным id не найдено остатка');
        });
    });

    describe('deleteStock', () => {
        it('should delete the stock and return success', async () => {
            const mockStock = {
                id: 1,
                productId: 1,
                shopId: 1,
                quantityInOrder: 10,
                quantityOnShelf: 10,
                product: { plu: '123456' }
            };

            prismaMock.stock.findUnique.mockResolvedValue(mockStock);
            prismaMock.stock.delete.mockResolvedValue(mockStock);

            const result = await stockService.deleteStock(1);

            expect(result).toEqual({ success: true });
            expect(prismaMock.stock.delete).toHaveBeenCalledWith({ where: { id: 1 } });
            expect(mockRabbitMQService.publishMessage).toHaveBeenCalledWith('events_exchange', 'stock.delete', {
                action: 'DELETE_STOCK',
                shopId: mockStock.shopId,
                plu: mockStock.product.plu,
                metadata: {
                    plu: mockStock.product.plu,
                    shopId: mockStock.shopId
                }
            });
        });

        it('should throw NotFoundException if the stock does not exist', async () => {
            prismaMock.stock.findUnique.mockResolvedValue(null);

            await expect(stockService.deleteStock(1)).rejects.toThrow('Остаток по данному id 1 не найден');
        });
    });

    describe('increaseStock', () => {
        it('should increase stock quantities and return success', async () => {
            const dto = { productId: 1, shopId: 2, quantityOnShelf: 5, quantityInOrder: 10 };
            const mockStock = {
                id: 1,
                quantityOnShelf: 15,
                quantityInOrder: 20,
                product: { plu: '1235' },
                shopId: 2,
                productId: 1
            };

            prismaMock.stock.update.mockResolvedValue(mockStock);

            const result = await stockService.increaseStock(dto);

            expect(result).toEqual({ success: true });
            expect(prismaMock.stock.update).toHaveBeenCalledWith({
                where: {
                    productId_shopId: {
                        productId: dto.productId,
                        shopId: dto.shopId
                    }
                },
                data: {
                    quantityOnShelf: { increment: dto.quantityOnShelf || 0 },
                    quantityInOrder: { increment: dto.quantityInOrder || 0 }
                },
                include: { product: true }
            });
            expect(mockRabbitMQService.publishMessage).toHaveBeenCalledWith('events_exchange', 'stock.increase', {
                action: 'INCREASE_STOCK',
                shopId: mockStock.shopId,
                plu: mockStock.product.plu,
                metadata: {
                    quantityOnShelf: dto.quantityOnShelf,
                    quantityInOrder: dto.quantityInOrder
                }
            });
        });

        it('should throw NotFoundException if stock is not found', async () => {
            prismaMock.stock.update.mockRejectedValue(new NotFoundException('Stock not found'));

            const dto = { productId: 1, shopId: 2, quantityOnShelf: 5, quantityInOrder: 10 };

            await expect(stockService.increaseStock(dto)).rejects.toThrow('Stock not found');
        });
    });

    describe('decreaseStock', () => {
        it('should decrease stock quantities and return success', async () => {
            const dto = { productId: 1, shopId: 2, quantityOnShelf: 3, quantityInOrder: 5 };
            const mockStock = {
                id: 1,
                quantityOnShelf: 7,
                quantityInOrder: 15,
                product: { plu: '1245' },
                shopId: 2,
                productId: 1
            };

            prismaMock.stock.update.mockResolvedValue(mockStock);

            const result = await stockService.decreaseStock(dto);

            expect(result).toEqual({ success: true });
            expect(prismaMock.stock.update).toHaveBeenCalledWith({
                where: {
                    productId_shopId: {
                        productId: dto.productId,
                        shopId: dto.shopId
                    }
                },
                data: {
                    quantityOnShelf: { decrement: dto.quantityOnShelf || 0 },
                    quantityInOrder: { decrement: dto.quantityInOrder || 0 }
                },
                include: { product: true }
            });
            expect(mockRabbitMQService.publishMessage).toHaveBeenCalledWith('events_exchange', 'stock.decrease', {
                action: 'DECREASE_STOCK',
                shopId: mockStock.shopId,
                plu: mockStock.product.plu,
                metadata: {
                    quantityOnShelf: dto.quantityOnShelf,
                    quantityInOrder: dto.quantityInOrder
                }
            });
        });

        it('should throw NotFoundException if stock is not found', async () => {
            prismaMock.stock.update.mockRejectedValue(new NotFoundException('Stock not found'));

            const dto = { productId: 1, shopId: 2, quantityOnShelf: 3, quantityInOrder: 5 };

            await expect(stockService.decreaseStock(dto)).rejects.toThrow('Stock not found');
        });
    });
});
