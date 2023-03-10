import { PartialType } from '@nestjs/mapped-types';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { IsFile } from '../file-storage/file-option.decorator';
import { USER_ROLES } from './user.entity';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  nama: string;

  @IsEnum(USER_ROLES)
  @IsNotEmpty()
  role: USER_ROLES;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @MinLength(8)
  @IsNotEmpty()
  password: string;

  @IsOptional()
  @IsFile(
    { mime: ['image/jpeg', 'image/jpg', 'image/png'] },
    { message: 'Jenis file tidak disupport' },
  )
  avatar?: any;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
