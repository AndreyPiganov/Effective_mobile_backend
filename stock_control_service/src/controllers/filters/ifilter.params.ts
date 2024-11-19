export interface StockFilterParams {
    shopId?: number;
    plu?: string;
    quantityOnShelf?: string;
    quantityInOrder?: string;
}

export interface ProductFilterParams {
    name?: string;
    plu?: string;
}
