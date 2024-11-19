import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { AdjustStockDto } from '../dto/adjust.dto';
import { CreateStockDto } from '../dto/create-stock.dto';
import { UpdateStockDto } from '../dto/update-stock.dto';
import { stockService } from '../services/stock.service';
import { StockFilterParams } from './filters/ifilter.params';
import { StockFilter } from './filters/filter.stock';

class StockController {
    async getStocks(req: Request, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ errors: errors.array() });
                return;
            }
            const filterParams: StockFilterParams = req.query;
            if (!filterParams) {
                throw new Error('filter params not provided');
            }
            const filter = new StockFilter(filterParams);
            const filterOptions = filter.getFilterOptions();
            const stocks = await stockService.getStocks(filterOptions);
            res.status(200).json(stocks);
        } catch (error) {
            next(error);
        }
    }

    async getStockById(req: Request, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ errors: errors.array() });
                return;
            }
            const id = parseInt(req.params.id, 10);
            const stock = await stockService.getStockById(id);
            res.status(200).json(stock);
        } catch (error) {
            next(error);
        }
    }

    async createStock(req: Request, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ errors: errors.array() });
                return;
            }
            const dto: CreateStockDto = req.body;
            const stock = await stockService.createStock(dto);
            res.status(201).json(stock);
        } catch (error) {
            next(error);
        }
    }

    async updateStock(req: Request, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ errors: errors.array() });
                return;
            }
            const id = parseInt(req.params.id, 10);
            const dto: UpdateStockDto = req.body;
            const stock = await stockService.updateStock(id, dto);
            res.status(200).json(stock);
        } catch (error) {
            next(error);
        }
    }

    async deleteStock(req: Request, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ errors: errors.array() });
                return;
            }
            const id = parseInt(req.params.id, 10);
            const result = await stockService.deleteStock(id);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }

    async increaseStock(req: Request, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ errors: errors.array() });
                return;
            }
            const dto: AdjustStockDto = req.body;
            const result = await stockService.increaseStock(dto);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }

    async decreaseStock(req: Request, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ errors: errors.array() });
                return;
            }
            const dto: AdjustStockDto = req.body;
            const result = await stockService.decreaseStock(dto);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }
}

export const stockController = new StockController();
