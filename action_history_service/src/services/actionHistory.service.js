import { NotFoundException } from '../exceptions/NotFoundExceptions.js';
import prisma from '../config/db.js';
import logger from '../config/logger.js';

class ActionHistoryService {
    constructor(prisma, logger) {
        this.prisma = prisma;
        this.logger = logger;
    }

    async getActions(filterOptions, page = 1, itemsPerPage = 5) {
        try {
            const offset = (page - 1) * itemsPerPage;
            const actions = await this.prisma.actionHistory.findMany({
                where: { ...filterOptions },
                skip: offset,
                take: itemsPerPage
            });
            this.logger.info('Fetched actions success');
            return actions;
        } catch (error) {
            this.logger.error('Error get filter action history:', error);
            throw new Error('Could not get filter action history');
        }
    }

    async getActionById(id) {
        try {
            const action = await this.prisma.actionHistory.findFirst({
                where: { id }
            });
            if (!action) {
                this.logger.warn(`Action with ID ${id} not found`);
                throw new NotFoundException('С данным id не найдено действия');
            }
            return action;
        } catch (error) {
            this.logger.error('Error get action by id:', error);
            throw error;
        }
    }

    async createAction(action, shopId, plu, metadata) {
        try {
            const actionProduct = await this.prisma.actionHistory.create({
                data: {
                    action,
                    shopId,
                    plu,
                    metadata
                }
            });
            this.logger.info('Create action success');
            return actionProduct;
        } catch (error) {
            this.logger.error('Error create action:', error);
            throw new Error('Could not create action');
        }
    }
}

export const actionHistoryService = new ActionHistoryService(prisma, logger);
