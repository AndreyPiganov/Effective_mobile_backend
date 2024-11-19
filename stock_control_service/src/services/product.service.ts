import { PrismaClient, Product } from '@prisma/client';
import logger from '../config/logger';
import prisma from '../config/db';
import { Logger } from 'winston';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { NotFoundException } from '../exceptions/NotFoundExceptions';
import { SuccessResponse } from './response/success.response';
import { ProductFilterOptions } from '../controllers/filters/ifilter.options';
import { rabbitMQService, RabbitMQService } from './rabbitMQ.service';

export class ProductService {
    private prisma: PrismaClient;
    private logger: Logger;
    private rabbitMQService: RabbitMQService;

    constructor(prisma: PrismaClient, logger: Logger, rabbitMQService: RabbitMQService) {
        this.prisma = prisma;
        this.logger = logger;
        this.rabbitMQService = rabbitMQService;
    }

    async getProducts(filterOptions: ProductFilterOptions) {
        try {
            const products = await this.prisma.product.findMany({
                where: { ...filterOptions }
            });
            this.logger.info('Fetched products success');
            return products;
        } catch (error) {
            this.logger.error('Errro get products:', error);
            throw new Error('Could not get products');
        }
    }

    async getProductById(id: number): Promise<Product> {
        try {
            const product = await this.prisma.product.findFirst({
                where: { id }
            });
            if (!product) {
                this.logger.warn(`Product with ID ${id} not found`);
                throw new NotFoundException(`По данному id ${id} не найдено товара`);
            }
            return product;
        } catch (error) {
            this.logger.error('Error get product by id:', error);
            throw error;
        }
    }

    async createProduct(dto: CreateProductDto): Promise<Product> {
        try {
            const product = await this.prisma.product.create({ data: { ...dto } });
            this.logger.info('Create product success');
            await this.rabbitMQService.publishMessage('events_exchange', 'product.create', {
                action: 'CREATE_PRODUCT',
                plu: product.plu,
                metadata: {
                    name: dto.name
                }
            });
            return product;
        } catch (error) {
            this.logger.error('Error create product:', error);
            throw new Error('Could not create product');
        }
    }

    async updateProduct(id: number, dto: UpdateProductDto): Promise<Product> {
        try {
            const product = await this.prisma.product.findFirst({ where: { id } });
            if (!product) {
                this.logger.warn(`Product with ID ${id} not found`);
                throw new NotFoundException('С данным id не найдено товара');
            }
            const updatedProduct = await this.prisma.product.update({
                where: { id },
                data: { ...dto }
            });

            await this.rabbitMQService.publishMessage('events_exchange', 'product.update', {
                action: 'UPDATE_PRODUCT',
                plu: product.plu,
                metadata: {
                    ...dto
                }
            });
            return updatedProduct;
        } catch (error) {
            this.logger.error('Error update product:', error);
            throw error;
        }
    }

    async deleteProduct(id: number): Promise<SuccessResponse> {
        try {
            const product = await this.prisma.product.findUnique({ where: { id } });
            if (!product) {
                this.logger.warn(`Product with ID ${id} not found`);
                throw new NotFoundException(`Продукт по данному id ${id} не найден`);
            }
            await this.prisma.product.delete({
                where: { id }
            });

            await this.rabbitMQService.publishMessage('events_exchange', 'product.delete', {
                action: 'DELETE_PRODUCT',
                plu: product.plu
            });

            return { success: true };
        } catch (error) {
            this.logger.error('Error delete product:', error);
            throw error;
        }
    }
}

export const productService = new ProductService(prisma, logger, rabbitMQService);
