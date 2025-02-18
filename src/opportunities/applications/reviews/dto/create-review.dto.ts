import { IsNotEmpty } from 'class-validator';

export class CreateReviewDto {
  @IsNotEmpty()
  note: number;

  @IsNotEmpty()
  data: string;

  @IsNotEmpty()
  application: string;
}
