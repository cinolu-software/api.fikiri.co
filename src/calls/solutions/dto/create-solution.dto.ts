import { IsNotEmpty, IsOptional } from 'class-validator';
import { ESatus } from 'src/calls/utils/enums/status.enum';

export class CreateSolutionDto {
  @IsNotEmpty()
  call: string;

  @IsNotEmpty()
  responses: JSON;

  @IsOptional()
  status: ESatus;
}
