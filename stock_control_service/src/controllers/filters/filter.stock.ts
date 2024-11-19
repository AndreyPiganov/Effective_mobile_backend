import { BaseFilter } from './base.filter';
import { StockFilterOptions } from './ifilter.options';

export class StockFilter extends BaseFilter {
    getFilterOptions(): StockFilterOptions {
        const filterOptions: StockFilterOptions = {};

        filterOptions.quantityOnShelf = this.parseQuantity(this.params.quantityOnShelf);
        filterOptions.quantityInOrder = this.parseQuantity(this.params.quantityInOrder);
        filterOptions.shop = { id: this.params.shopId };
        filterOptions.product = { plu: { contains: this.params.plu, mode: 'insensitive' } };

        return filterOptions;
    }

    private parseQuantity(quantity: string): number | { gte: number; lte: number } | null {
        if (!quantity) return undefined;
        const quantityRange = quantity.split(',');
        if (quantityRange.length === 1) {
            return parseInt(quantityRange[0], 10);
        } else if (quantityRange.length === 2) {
            return { gte: parseInt(quantityRange[0], 10), lte: parseInt(quantityRange[1], 10) };
        }
        throw new Error('Invalid quanity format');
    }
}
