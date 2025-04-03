import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export default class CreateUserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  phone_number: string;

  @IsNotEmpty()
  address: string;

  @IsOptional()
  organisation: string;

  @IsOptional()
  bio: string;

  @IsOptional()
  socials: JSON;

  @IsNotEmpty()
  roles: string[];
}
