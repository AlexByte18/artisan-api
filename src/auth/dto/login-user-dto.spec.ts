import { plainToClass } from "class-transformer"
import { LoginUserDto } from "./login-user-dto"
import { validate } from "class-validator";

describe('LoginUserDto', () => {

  it('should have the correct properties', async () => {
    const loginUserDto = plainToClass(LoginUserDto, {
      email: 'test@test.com',
      password: 'Password123',
    });

    const errors = await validate(loginUserDto);

    expect(errors.length).toBe(0);
  });


  it('shold throw error if password is not valid', async () => {
    const loginUserDto = plainToClass(LoginUserDto, {
      email: 'test@test.com',
      password: 'invalidpassword',
    });

    const errors = validate(loginUserDto);
    const passwordError = (await errors).find(error => error.property === 'password');

    expect(passwordError).toBeDefined();
    expect(passwordError.constraints).toBeDefined();
    expect(passwordError.constraints.matches).toBe('The password must have a Uppercase, lowercase letter and a number');
  })

})