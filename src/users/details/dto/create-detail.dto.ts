import { IsOptional } from 'class-validator';

export class CreateDetailDto {
  @IsOptional()
  bio: string;

  @IsOptional()
  socials: string;
}
