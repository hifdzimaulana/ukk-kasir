import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumberString,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { CreateDetailTransaksiDto } from '../detail-transaksi/detail-transaksi.dto';
import { STATUS_TRANSAKSI } from './transaksi.entity';

export class CreateTransaksiDto {
  @IsNumberString()
  @MaxLength(3)
  @IsNotEmpty()
  nomor_meja: string;

  @IsString()
  @IsNotEmpty()
  nama_pelanggan: string;

  @IsEnum(STATUS_TRANSAKSI)
  @IsOptional()
  status?: STATUS_TRANSAKSI;

  @IsArray()
  @ValidateNested()
  @Type(() => CreateDetailTransaksiDto)
  payload: CreateDetailTransaksiDto[];
}

export class UpdateTransaksiDto extends PartialType(CreateTransaksiDto) {}
