import { IsNotEmpty, IsOptional } from 'class-validator';
import { PartnerType } from '../utils/enums/partner-type.enum';

export class CreatePartnerDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  type: PartnerType;

  @IsOptional()
  link: string;
}
