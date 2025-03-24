import { IsNotEmpty } from 'class-validator';

export class CreateApplicationDto {
  @IsNotEmpty()
  call: string;

  @IsNotEmpty()
  responses: JSON;
}
