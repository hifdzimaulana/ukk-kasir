import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateMejaDto, UpdateMejaDto } from './meja.dto';
import { STATUS_MEJA } from './meja.entity';
import { MejaService } from './meja.service';

@Controller('meja')
export class MejaController {
  constructor(private readonly mejaService: MejaService) {}

  @Get()
  findAll(@Query('status') status: STATUS_MEJA) {
    return this.mejaService.findAll(status);
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

  @Patch('/:id/toggle-status')
  toggleStatus(@Param('id') id: string) {
    return this.mejaService.toggleStatus(id);
  }

  @Delete('/:id')
  remove(@Param('id') id: string) {
    return this.mejaService.remove(id);
  }
}
