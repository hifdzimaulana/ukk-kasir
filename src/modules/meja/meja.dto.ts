import { PartialType } from '@nestjs/mapped-types';
import {
  IsEnum,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  MaxLength,
} from 'class-validator';
import { STATUS_MEJA } from './meja.entity';

export class CreateMejaDto {
  @IsNumberString()
  @IsNotEmpty()
  @MaxLength(3)
  nomor_meja: string;

  @IsEnum(STATUS_MEJA)
  @IsOptional()
  status: STATUS_MEJA;
}

export class UpdateMejaDto extends PartialType(CreateMejaDto) {}
