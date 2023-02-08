import { PartialType } from '@nestjs/mapped-types';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
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
  avatar?: any;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
