import { plainToClass } from "class-transformer"
import { PaginationDto } from "./pagination.dto"
import { validate } from "class-validator";

describe('PaginationDto', () =>  {
  it('shold work with default parameters', async () => {
    const paginationDto = plainToClass(PaginationDto, {});

    const errors = await validate(paginationDto);
    
    expect(paginationDto).toBeDefined();
    expect(errors.length).toBe(0);
  });

  it('should validate limit as a positive number', async () => {
    const paginationDto = plainToClass(PaginationDto, { limit: -1 });

    const errors = await validate(paginationDto);

    const limitError = errors.find(error => error.property === 'limit');

    expect(limitError).toBeDefined();
    expect(limitError.constraints.isPositive).toBeDefined();
  });

});