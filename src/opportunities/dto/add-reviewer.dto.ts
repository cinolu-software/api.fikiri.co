import { IsNotEmpty } from 'class-validator';

export class addReviewerDto {
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  organization: string;

  @IsNotEmpty()
  solution: number;
}
