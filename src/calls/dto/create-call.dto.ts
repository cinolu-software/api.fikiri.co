import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateCallDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  description: string;

  @IsOptional()
  form: string;

  @IsOptional()
  requirements: string;
}
