import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { CreateShopDto } from '../dto/create-shop.dto';
import { UpdateShopDto } from '../dto/update-shop.dto';
import { shopService } from '../services/shop.service';

class ShopController {
    async getAllShops(_: Request, res: Response, next: NextFunction) {
        try {
            const shops = await shopService.getAllShops();
            res.status(200).json(shops);
        } catch (error) {
            next(error);
        }
    }

    async getShopById(req: Request, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ errors: errors.array() });
                return;
            }
            const id = parseInt(req.params.id, 10);
            const shop = await shopService.getShopById(id);
            res.status(200).json(shop);
        } catch (error) {
            next(error);
        }
    }

    async createShop(req: Request, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ errors: errors.array() });
                return;
            }
            const dto: CreateShopDto = req.body;
            const shop = await shopService.createShop(dto);
            res.status(201).json(shop);
        } catch (error) {
            next(error);
        }
    }

    async updateShop(req: Request, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ errors: errors.array() });
                return;
            }
            const dto: UpdateShopDto = req.body;
            const id = parseInt(req.params.id, 10);
            const shop = await shopService.updateShop(id, dto);
            res.status(200).json(shop);
        } catch (error) {
            next(error);
        }
    }

    async deleteShop(req: Request, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ errors: errors.array() });
                return;
            }
            const id = parseInt(req.params.id, 10);
            const result = await shopService.deleteShop(id);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }
}

export const shopController = new ShopController();
