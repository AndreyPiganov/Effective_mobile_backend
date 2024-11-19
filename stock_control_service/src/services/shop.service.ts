import { PrismaClient, Shop } from '@prisma/client';
import prisma from '../config/db';
import logger from '../config/logger';
import { CreateShopDto } from '../dto/create-shop.dto';
import { UpdateShopDto } from '../dto/update-shop.dto';
import { NotFoundException } from '../exceptions/NotFoundExceptions';
import { Logger } from 'winston';
import { SuccessResponse } from './response/success.response';

export class ShopService {
    private prisma: PrismaClient;
    private logger: Logger;

    constructor(prisma: PrismaClient, logger: Logger) {
        this.prisma = prisma;
        this.logger = logger;
    }

    async getAllShops(): Promise<Shop[]> {
        try {
            const shops = await this.prisma.shop.findMany({ take: 100 });
            this.logger.info('Fetched all shops success');
            return shops;
        } catch (error) {
            this.logger.error('Error get shops:', error);
            throw new Error('Could not get shops');
        }
    }

    async getShopById(id: number): Promise<Shop> {
        try {
            const shop = await this.prisma.shop.findFirst({
                where: { id }
            });
            if (!shop) {
                this.logger.warn(`Shop with ID ${id} not found`);
                throw new NotFoundException(`По данному id ${id} не найдено товара`);
            }
            return shop;
        } catch (error) {
            this.logger.error('Error get shop by id', error);
            throw error;
        }
    }

    async createShop(dto: CreateShopDto): Promise<Shop> {
        try {
            const shop = await this.prisma.shop.create({ data: { ...dto } });
            this.logger.info('Create shop success');
            return shop;
        } catch (error) {
            this.logger.error('Error create shop:', error);
            throw new Error('Could not create shop');
        }
    }

    async updateShop(id: number, dto: UpdateShopDto): Promise<Shop> {
        try {
            const shop = await this.prisma.shop.findFirst({ where: { id } });
            if (!shop) {
                this.logger.warn(`Shop with ID ${id} not found`);
                throw new NotFoundException('С данным id не найдено магазина');
            }
            return await this.prisma.shop.update({
                where: { id },
                data: { ...dto }
            });
        } catch (error) {
            this.logger.error('Error update shop:', error);
            throw error;
        }
    }

    async deleteShop(id: number): Promise<SuccessResponse> {
        try {
            const shop = await this.prisma.shop.findUnique({ where: { id } });
            if (!shop) {
                this.logger.warn(`Shop with ID ${id} not found`);
                throw new NotFoundException(`Магазин по данному id ${id} не найден`);
            }
            await this.prisma.shop.delete({
                where: { id }
            });

            return { success: true };
        } catch (error) {
            this.logger.error('Error delete shop:', error);
            throw error;
        }
    }
}

export const shopService = new ShopService(prisma, logger);
