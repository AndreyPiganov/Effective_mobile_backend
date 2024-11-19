import { BaseFilter } from './base.filter';
import { ProductFilterOptions } from './ifilter.options';

export class ProductFilter extends BaseFilter {
    getFilterOptions(): ProductFilterOptions {
        const filterOptions: ProductFilterOptions = {};

        filterOptions.name = { contains: this.params.name, mode: 'insensitive' };
        filterOptions.plu = { contains: this.params.plu, mode: 'insensitive' };

        return filterOptions;
    }
}
