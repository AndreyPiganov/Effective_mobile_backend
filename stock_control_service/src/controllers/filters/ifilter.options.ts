export interface StockFilterOptions {
    product?: { plu: { contains: string; mode: 'default' | 'insensitive' } };
    shop?: { id: number };
    quantityInOrder?: number | { gte: number; lte: number };
    quantityOnShelf?: number | { gte: number; lte: number };
}

export interface ProductFilterOptions {
    name?: { contains: string; mode: 'default' | 'insensitive' };
    plu?: { contains: string; mode: 'default' | 'insensitive' };
}
