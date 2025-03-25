import { IsNotEmpty } from 'class-validator';

export class CreateSolutionDto {
  @IsNotEmpty()
  call: string;

  @IsNotEmpty()
  responses: JSON;
}
