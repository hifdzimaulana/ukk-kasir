import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsNumberString, MaxLength } from 'class-validator';

export class CreateMejaDto {
  @IsNumberString()
  @IsNotEmpty()
  @MaxLength(3)
  nomor_meja: string;
}

export class UpdateMejaDto extends PartialType(CreateMejaDto) {}
