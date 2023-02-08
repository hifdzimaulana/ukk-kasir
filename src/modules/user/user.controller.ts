import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
} from '@nestjs/common';
import {
  Delete,
  Get,
  Param,
  Patch,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common/decorators';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import { UserService } from './user.service';

@Controller('user')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get('/:id')
  findById(@Param('id') id: string) {
    return this.userService.findById(id);
  }

  @Post()
  @UseInterceptors(FileInterceptor('avatar'))
  store(
    @UploadedFile() avatar: Express.Multer.File,
    @Body() dto: CreateUserDto,
  ) {
    return this.userService.store(dto, avatar);
  }

  @Patch('/:id')
  @UseInterceptors(FileInterceptor('avatar'))
  update(
    @Param('id') id: string,
    @UploadedFile() avatar: Express.Multer.File,
    @Body() dto: UpdateUserDto,
  ) {
    return this.userService.update(id, dto, avatar);
  }

  @Delete('/:id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
