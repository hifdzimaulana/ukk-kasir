import { Controller } from '@nestjs/common';
import {
  Body,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common/decorators';
import { FileInterceptor } from '@nestjs/platform-express';
import { PublicRoute } from '../auth/public-route.decorator';
import { CreateMenuDto, UpdateMenuDto } from './menu.dto';
import { MenuService } from './menu.service';

@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @PublicRoute()
  @Get()
  findAll() {
    return this.menuService.findAll();
  }

  @PublicRoute()
  @Get('/:id')
  findById(@Param('id') id: string) {
    return this.menuService.findById(id);
  }

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  store(
    @UploadedFile() image: Express.Multer.File,
    @Body() payload: CreateMenuDto,
  ) {
    return this.menuService.store(payload, image);
  }

  @Patch('/:id')
  @UseInterceptors(FileInterceptor('image'))
  update(
    @Param('id') id: string,
    @UploadedFile() image: Express.Multer.File,
    @Body() payload: UpdateMenuDto,
  ) {
    return this.menuService.update(id, payload, image);
  }

  @Delete('/:id')
  remove(@Param('id') id: string) {
    return this.menuService.remove(id);
  }
}
