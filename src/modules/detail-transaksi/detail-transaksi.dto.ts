import { PartialType } from '@nestjs/mapped-types';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateDetailTransaksiDto {
  @IsUUID()
  @IsNotEmpty()
  id_menu: string;

  @IsNumber()
  @IsNotEmpty()
  qty: number;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class UpdateDetailTransaksiDto extends PartialType(
  CreateDetailTransaksiDto,
) {}
