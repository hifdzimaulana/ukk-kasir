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
import { CheckPolicies } from '../auth/policy.decorator';
import { Actions, AppAbility } from '../casl/casl-ability.factory';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import { User } from './user.entity';
import { UserService } from './user.service';

@Controller('user')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @CheckPolicies((a: AppAbility) => a.can(Actions.Read, User))
  findAll() {
    return this.userService.findAll();
  }

  @Get('/:id')
  @CheckPolicies((a: AppAbility) => a.can(Actions.Read, User))
  findById(@Param('id') id: string) {
    return this.userService.findById(id);
  }

  @Post()
  @CheckPolicies((a: AppAbility) => a.can(Actions.Create, User))
  @UseInterceptors(FileInterceptor('avatar'))
  store(
    @UploadedFile() avatar: Express.Multer.File,
    @Body() dto: CreateUserDto,
  ) {
    return this.userService.store(dto, avatar);
  }

  @Patch('/:id')
  @CheckPolicies((a: AppAbility) => a.can(Actions.Update, User))
  @UseInterceptors(FileInterceptor('avatar'))
  update(
    @Param('id') id: string,
    @UploadedFile() avatar: Express.Multer.File,
    @Body() dto: UpdateUserDto,
  ) {
    return this.userService.update(id, dto, avatar);
  }

  @Delete('/:id')
  @CheckPolicies((a: AppAbility) => a.can(Actions.Delete, User))
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
