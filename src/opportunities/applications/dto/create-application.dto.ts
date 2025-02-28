import { IsNotEmpty } from 'class-validator';

export class CreateApplicationDto {
  @IsNotEmpty()
  opportunity: string;

  @IsNotEmpty()
  responses: JSON;
}
