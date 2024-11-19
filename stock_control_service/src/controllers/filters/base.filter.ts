import { ProductFilterOptions, StockFilterOptions } from './ifilter.options';
import { ProductFilterParams, StockFilterParams } from './ifilter.params';

export abstract class BaseFilter {
    constructor(protected params: StockFilterParams & ProductFilterParams) {}

    abstract getFilterOptions(): StockFilterOptions & ProductFilterOptions;
}
