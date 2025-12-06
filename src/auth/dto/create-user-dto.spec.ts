import { validate } from "class-validator";
import { CreateUserDto } from "./create-user-dto";
import { error } from "console";

describe('CreateUserDto', () => {

  it('should have the correct properties', async () => {
    const createUserDto = new CreateUserDto();

    createUserDto.email = 'test@test.com';
    createUserDto.password = 'Password123';
    createUserDto.fullName = 'User test';
    
    const errors = await validate(createUserDto);

    expect(errors.length).toBe(0);
  });

  it('shold throw errors if password in not valid', async () => {
    const createUserDto = new CreateUserDto();

    createUserDto.email = 'test@test.com';
    createUserDto.password = 'password';
    createUserDto.fullName = 'User test';
    
    const errors = await validate(createUserDto);
    const passwordError = errors.find(error => error.property === 'password');

    expect(passwordError).toBeDefined();
    expect(passwordError.constraints).toBeDefined();
    expect(passwordError.constraints.matches).toBe('The password must have a Uppercase, lowercase letter and a number');
  });

});