import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateOpportunityDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  ended_at: Date;

  @IsNotEmpty()
  started_at: Date;

  @IsNotEmpty()
  description: string;

  @IsOptional()
  form: string;

  @IsOptional()
  requirements: string;
}
