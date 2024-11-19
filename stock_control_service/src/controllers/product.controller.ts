import { NextFunction, Request, Response } from 'express';
import { productService } from '../services/product.service';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { validationResult } from 'express-validator';
import { ProductFilterParams } from './filters/ifilter.params';
import { ProductFilter } from './filters/filter.product';

class ProductController {
    async getProducts(req: Request, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ errors: errors.array() });
                return;
            }
            const filterParams: ProductFilterParams = req.query;
            if (!filterParams) {
                throw new Error('filter params not provided');
            }
            const filter = new ProductFilter(filterParams);
            const filterOptions = filter.getFilterOptions();
            const products = await productService.getProducts(filterOptions);
            res.status(200).json(products);
        } catch (error) {
            next(error);
        }
    }

    async getProductById(req: Request, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ errors: errors.array() });
                return;
            }
            const id = parseInt(req.params.id, 10);
            const product = await productService.getProductById(id);
            res.status(200).json(product);
        } catch (error) {
            next(error);
        }
    }

    async createProduct(req: Request, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ errors: errors.array() });
                return;
            }
            const dto: CreateProductDto = req.body;
            const product = await productService.createProduct(dto);
            res.status(201).json(product);
        } catch (error) {
            next(error);
        }
    }

    async updateProduct(req: Request, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ errors: errors.array() });
                return;
            }
            const dto: UpdateProductDto = req.body;
            const id = parseInt(req.params.id, 10);
            const product = await productService.updateProduct(id, dto);
            res.status(200).json(product);
        } catch (error) {
            next(error);
        }
    }

    async deleteProduct(req: Request, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ errors: errors.array() });
                return;
            }
            const id = parseInt(req.params.id, 10);
            const result = await productService.deleteProduct(id);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }
}

export const productController = new ProductController();
