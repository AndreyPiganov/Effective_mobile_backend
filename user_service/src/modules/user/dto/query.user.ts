import { Transform } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class QueryUser {
    @IsOptional()
    @IsNumber()
    @Transform(({ value }) => (value ? Number(value) : 1))
    page: number;
    @IsOptional()
    @IsNumber()
    @Transform(({ value }) => (value ? Number(value) : 5))
    itemsPerPage: number;
}
