import { PrismaClient, Stock } from '@prisma/client';
import prisma from '../config/db';
import logger from '../config/logger';
import { CreateStockDto } from '../dto/create-stock.dto';
import { NotFoundException } from '../exceptions/NotFoundExceptions';
import { Logger } from 'winston';
import { SuccessResponse } from './response/success.response';
import { UpdateStockDto } from '../dto/update-stock.dto';
import { AdjustStockDto } from '../dto/adjust.dto';
import { StockFilterOptions } from '../controllers/filters/ifilter.options';
import { rabbitMQService, RabbitMQService } from './rabbitMQ.service';

export class StockService {
    private prisma: PrismaClient;
    private logger: Logger;
    private rabbitMQService: RabbitMQService;

    constructor(prisma: PrismaClient, logger: Logger, rabbitMQService: RabbitMQService) {
        this.prisma = prisma;
        this.logger = logger;
        this.rabbitMQService = rabbitMQService;
    }

    async getStocks(filterOptions: StockFilterOptions) {
        try {
            const stocks = await this.prisma.stock.findMany({
                where: { ...filterOptions },
                include: { product: true, shop: true }
            });
            this.logger.info('Fetched stocks success ');
            return stocks;
        } catch (error) {
            this.logger.error('Error get stocks:', error);
            throw new Error('Could not get stocks');
        }
    }

    async getStockById(id: number): Promise<Stock> {
        try {
            const stock = await this.prisma.stock.findFirst({
                where: { id }
            });
            if (!stock) {
                this.logger.warn(`Stock with ID ${id} not found`);
                throw new NotFoundException(`По данному id ${id} не найдено остатка`);
            }
            return stock;
        } catch (error) {
            this.logger.error('Error get stock by id:', error);
            throw error;
        }
    }

    async createStock(dto: CreateStockDto): Promise<Stock> {
        try {
            const stock = await this.prisma.stock.create({
                data: {
                    quantityInOrder: dto.quantityInOrder,
                    quantityOnShelf: dto.quantityOnShelf,
                    product: { connect: { id: dto.productId } },
                    shop: { connect: { id: dto.shopId } }
                },
                include: { product: true }
            });
            this.logger.info('Create stock success');
            await this.rabbitMQService.publishMessage('events_exchange', 'stock.create', {
                action: 'CREATE_STOCK',
                shopId: stock.shopId,
                plu: stock.product.plu,
                metadata: {
                    ...dto
                }
            });
            return stock;
        } catch (error) {
            this.logger.error('Error create stock:', error);
            throw new Error('Could not create stock');
        }
    }

    async updateStock(id: number, dto: UpdateStockDto): Promise<Stock> {
        try {
            const stock = await this.prisma.stock.findFirst({ where: { id }, include: { product: true } });
            if (!stock) {
                this.logger.warn(`Stock with ID ${id} not found`);
                throw new NotFoundException('С данным id не найдено остатка');
            }

            const updateStock = await this.prisma.stock.update({
                where: { id },
                data: { ...dto }
            });
            await this.rabbitMQService.publishMessage('events_exchange', 'stock.update', {
                action: 'UPDATE_STOCK',
                shopId: stock.shopId,
                plu: stock.product.plu,
                metadata: {
                    ...dto
                }
            });
            return updateStock;
        } catch (error) {
            this.logger.error('Error update stock:', error);
            throw error;
        }
    }

    async deleteStock(id: number): Promise<SuccessResponse> {
        try {
            const stock = await this.prisma.stock.findUnique({ where: { id }, include: { product: true } });
            if (!stock) {
                this.logger.warn(`Stock with ID ${id} not found`);
                throw new NotFoundException(`Остаток по данному id ${id} не найден`);
            }
            await this.prisma.stock.delete({
                where: { id }
            });

            await this.rabbitMQService.publishMessage('events_exchange', 'stock.delete', {
                action: 'DELETE_STOCK',
                shopId: stock.shopId,
                plu: stock.product.plu,
                metadata: {
                    plu: stock.product.plu,
                    shopId: stock.shopId
                }
            });

            return { success: true };
        } catch (error) {
            this.logger.error('Error delete stock:', error);
            throw error;
        }
    }

    async increaseStock(dto: AdjustStockDto): Promise<SuccessResponse> {
        try {
            const stock = await this.prisma.stock.update({
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

            if (!stock) {
                this.logger.warn('Остаток не удалось найти');
                throw new NotFoundException('Stock not found');
            }
            this.logger.info('Остаток был увеличен');

            await this.rabbitMQService.publishMessage('events_exchange', 'stock.increase', {
                action: 'INCREASE_STOCK',
                shopId: stock.shopId,
                plu: stock.product.plu,
                metadata: {
                    quantityOnShelf: dto.quantityOnShelf,
                    quantityInOrder: dto.quantityInOrder
                }
            });

            return { success: true };
        } catch (error) {
            this.logger.error('Error increase stock:', error);
            throw error;
        }
    }

    async decreaseStock(dto: AdjustStockDto): Promise<SuccessResponse> {
        try {
            const stock = await this.prisma.stock.update({
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

            if (!stock) {
                this.logger.warn('Остаток не удалось найти');
                throw new NotFoundException('Stock not found');
            }
            this.logger.info('Остаток был уменьшен');

            await this.rabbitMQService.publishMessage('events_exchange', 'stock.decrease', {
                action: 'DECREASE_STOCK',
                shopId: stock.shopId,
                plu: stock.product.plu,
                metadata: {
                    quantityOnShelf: dto.quantityOnShelf,
                    quantityInOrder: dto.quantityInOrder
                }
            });

            return { success: true };
        } catch (error) {
            this.logger.error('Error decrease stock:', error);
            throw error;
        }
    }
}

export const stockService = new StockService(prisma, logger, rabbitMQService);
