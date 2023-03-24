import { Type } from "class-transformer"
import { IsOptional, IsPositive, Min, min } from "class-validator"

export class PaginationDto {

    @IsOptional()
    @IsPositive()
    @Type(() => Number)
    limit?: number
    
    @IsOptional()
    @IsPositive()
    @Min(0)
    @Type(() => Number)
    offset?: number

}