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
import { STATUS_MEJA } from '../meja/meja.entity';
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
  status_transaksi: STATUS_TRANSAKSI;

  @IsEnum(STATUS_MEJA)
  @IsOptional()
  status_meja: STATUS_MEJA;
}

export class GetAllTransaksiQuery {
  @IsOptional()
  getMeja?: any;
  @IsOptional()
  getUser?: any;
  @IsOptional()
  getMenu?: any;

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
