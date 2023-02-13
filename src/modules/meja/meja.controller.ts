import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateMejaDto, UpdateMejaDto } from './meja.dto';
import { MejaService } from './meja.service';

@Controller('meja')
export class MejaController {
  constructor(private readonly mejaService: MejaService) {}

  @Get()
  findAll() {
    return this.mejaService.findAll();
  }
  @Get('/:id')
  findById(@Param('id') id: string) {
    return this.mejaService.findById(id);
  }

  @Post()
  store(@Body() payload: CreateMejaDto) {
    return this.mejaService.store(payload);
  }

  @Patch('/:id')
  update(@Param('id') id: string, @Body() payload: UpdateMejaDto) {
    return this.mejaService.update(id, payload);
  }

  @Delete('/:id')
  remove(@Param('id') id: string) {
    return this.mejaService.remove(id);
  }
}
