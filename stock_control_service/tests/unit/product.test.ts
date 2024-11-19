import { prismaMock } from '../singleton';
import { ProductService } from '../../src/services/product.service';
import { ProductFilterOptions } from '../../src/controllers/filters/ifilter.options';
import logger from '../../src/config/logger';
import { RabbitMQService } from '../../src/services/rabbitMQ.service';

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

describe('ProductService', () => {
    let productService: ProductService;
    let mockRabbitMQService: jest.Mocked<RabbitMQService>;

    beforeEach(() => {
        mockRabbitMQService = new (jest.requireMock('../../src/services/rabbitMQ.service').RabbitMQService)();
        productService = new ProductService(prismaMock, logger, mockRabbitMQService);
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.resetModules();
    });

    describe('getProducts', () => {
        it('should return a list of products', async () => {
            const mockProducts = [
                { id: 1, name: 'Product 1', plu: '12345' },
                { id: 2, name: 'Product 2', plu: '67890' }
            ];

            prismaMock.product.findMany.mockResolvedValue(mockProducts);

            const filterOptions: ProductFilterOptions = { name: { contains: 'Product', mode: 'insensitive' } };
            const result = await productService.getProducts(filterOptions);

            expect(result).toEqual(mockProducts);
            expect(prismaMock.product.findMany).toHaveBeenCalledWith({ where: { ...filterOptions } });
        });

        it('should throw an error if fetching products fails', async () => {
            prismaMock.product.findMany.mockRejectedValue(new Error('Database error'));

            expect(productService.getProducts({})).rejects.toThrow('Could not get products');
        });
    });

    describe('getProductById', () => {
        it('should return the product for a valid ID', async () => {
            const mockProduct = { id: 1, name: 'Product 1', plu: '12345' };

            prismaMock.product.findFirst.mockResolvedValue(mockProduct);

            const result = await productService.getProductById(1);

            expect(result).toEqual(mockProduct);
            expect(prismaMock.product.findFirst).toHaveBeenCalledWith({ where: { id: 1 } });
        });

        it('should throw NotFoundException for an invalid ID', async () => {
            prismaMock.product.findFirst.mockResolvedValue(null);

            expect(productService.getProductById(1)).rejects.toThrow('По данному id 1 не найдено товара');
        });

        it('should log and rethrow errors', async () => {
            prismaMock.product.findFirst.mockRejectedValue(new Error('Database error'));

            expect(productService.getProductById(1)).rejects.toThrow('Database error');
        });
    });

    describe('createProduct', () => {
        it('should create and return a new product', async () => {
            const dto = { name: 'New Product', plu: '54321' };
            const mockProduct = { id: 1, ...dto };

            prismaMock.product.create.mockResolvedValue(mockProduct);

            const result = await productService.createProduct(dto);

            expect(result).toEqual(mockProduct);
            expect(prismaMock.product.create).toHaveBeenCalledWith({ data: { ...dto } });
            expect(mockRabbitMQService.publishMessage).toHaveBeenCalledWith('events_exchange', 'product.create', {
                action: 'CREATE_PRODUCT',
                plu: mockProduct.plu,
                metadata: { name: dto.name }
            });
        });

        it('should log and rethrow errors', async () => {
            const dto = { name: 'New Product', plu: '54321' };

            prismaMock.product.create.mockRejectedValue(new Error('Database error'));

            expect(productService.createProduct(dto)).rejects.toThrow('Could not create product');
        });
    });

    describe('updateProduct', () => {
        it('should update and return the product', async () => {
            const id = 1;
            const dto = { name: 'Updated Product' };
            const mockProduct = { id, name: 'Old Product', plu: '12345' };
            const updatedProduct = { ...mockProduct, ...dto };

            prismaMock.product.findFirst.mockResolvedValue(mockProduct);
            prismaMock.product.update.mockResolvedValue(updatedProduct);

            const result = await productService.updateProduct(id, dto);

            expect(result).toEqual(updatedProduct);
            expect(prismaMock.product.update).toHaveBeenCalledWith({ where: { id }, data: { ...dto } });
            expect(mockRabbitMQService.publishMessage).toHaveBeenCalledWith('events_exchange', 'product.update', {
                action: 'UPDATE_PRODUCT',
                plu: mockProduct.plu,
                metadata: { name: dto.name }
            });
        });

        it('should throw NotFoundException if the product does not exist', async () => {
            prismaMock.product.findFirst.mockResolvedValue(null);

            expect(productService.updateProduct(1, {})).rejects.toThrow('С данным id не найдено товара');
        });
    });

    describe('deleteProduct', () => {
        it('should delete the product and return success', async () => {
            const mockProduct = { id: 1, name: 'Product', plu: '12345' };

            prismaMock.product.findUnique.mockResolvedValue(mockProduct);
            prismaMock.product.delete.mockResolvedValue(mockProduct);

            const result = await productService.deleteProduct(1);

            expect(result).toEqual({ success: true });
            expect(prismaMock.product.delete).toHaveBeenCalledWith({ where: { id: 1 } });
            expect(mockRabbitMQService.publishMessage).toHaveBeenCalledWith('events_exchange', 'product.delete', {
                action: 'DELETE_PRODUCT',
                plu: mockProduct.plu
            });
        });

        it('should throw NotFoundException if the product does not exist', async () => {
            prismaMock.product.findUnique.mockResolvedValue(null);

            expect(productService.deleteProduct(1)).rejects.toThrow('Продукт по данному id 1 не найден');
        });
    });
});
