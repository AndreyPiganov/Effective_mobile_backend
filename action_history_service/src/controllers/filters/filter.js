import { BaseFilter } from './base.filter.js';

export class Filter extends BaseFilter {
    getFilterOptions() {
        const filterOptions = {};

        filterOptions.timestamp = this.parseDate(this.params.date);
        filterOptions.plu = { contains: this.params.plu, mode: 'insensitive' };
        filterOptions.action = this.params.action;
        filterOptions.shopId = this.params.shopId;

        return filterOptions;
    }

    parseDate(date) {
        if (!date) return undefined;
        const dateRange = date.split(',');
        if (dateRange.length === 1) {
            const startDate = new Date(dateRange[0]);
            const endDate = new Date(startDate);
            endDate.setDate(startDate.getDate() + 1);
            return { gte: new Date(dateRange[0]), lte: endDate };
        } else if (dateRange.length === 2) {
            return { gte: new Date(dateRange[0]), lte: new Date(dateRange[1]) };
        }
        throw new Error('Invalid date format');
    }
}
