import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  IsUUID,
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

export class UpdateStatusTransaksiDto {
  @IsEnum(STATUS_TRANSAKSI)
  @IsNotEmpty()
  status: STATUS_TRANSAKSI;
}

export class GetAllTransaksiQuery {
  @IsEnum(STATUS_TRANSAKSI)
  @IsOptional()
  status?: STATUS_TRANSAKSI;
  @IsDateString()
  @IsOptional()
  after?: string;
  @IsDateString()
  @IsOptional()
  before?: string;
  @IsUUID()
  @IsOptional()
  userId?: string;
}
