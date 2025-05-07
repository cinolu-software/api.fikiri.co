import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { Match } from 'src/shared/decorators/match.decorator';

export class SignUpDto {
  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;

  @Match('password')
  password_confirm: string;

  @IsNotEmpty()
  address: string;

  @IsNotEmpty()
  phone_number: string;

  @IsNotEmpty()
  name: string;
}
