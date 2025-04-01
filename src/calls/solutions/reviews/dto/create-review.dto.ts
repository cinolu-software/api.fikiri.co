import { IsNotEmpty } from 'class-validator';

export class CreateReviewDto {
  @IsNotEmpty()
  data: JSON;

  @IsNotEmpty()
  solution: string;
}
