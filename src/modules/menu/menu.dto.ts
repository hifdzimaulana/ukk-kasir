import { PartialType } from '@nestjs/mapped-types';
import {
  IsEnum,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';
import { IsFile } from '../file-storage/file-option.decorator';
import { JENIS_MENU } from './menu.entity';

export class CreateMenuDto {
  @IsString()
  @IsNotEmpty()
  nama: string;

  @IsEnum(JENIS_MENU)
  @IsNotEmpty()
  jenis: JENIS_MENU;

  @IsString()
  @IsOptional()
  deskripsi?: string;

  @IsNumberString()
  @IsNotEmpty()
  harga: number;

  @IsOptional()
  @IsFile(
    { mime: ['image/jpeg', 'image/jpg', 'image/png'] },
    { message: 'Jenis file tidak disupport' },
  )
  image?: any;
}

export class UpdateMenuDto extends PartialType(CreateMenuDto) {}
