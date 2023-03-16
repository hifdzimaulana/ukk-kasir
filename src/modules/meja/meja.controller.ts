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
import { CheckPolicies } from '../auth/policy.decorator';
import { Actions, AppAbility } from '../casl/casl-ability.factory';
import { CreateMejaDto, MejaQuery, UpdateMejaDto } from './meja.dto';
import { Meja } from './meja.entity';
import { MejaService } from './meja.service';

@Controller('meja')
export class MejaController {
  constructor(private readonly mejaService: MejaService) {}

  @Get()
  @CheckPolicies((a: AppAbility) => a.can(Actions.Read, Meja))
  findAll(@Query() query: MejaQuery) {
    return this.mejaService.findAll(query);
  }
  @Get('/:id')
  @CheckPolicies((a: AppAbility) => a.can(Actions.Read, Meja))
  findById(@Param('id') id: string) {
    return this.mejaService.findById(id);
  }

  @Post()
  @CheckPolicies((a: AppAbility) => a.can(Actions.Create, Meja))
  store(@Body() payload: CreateMejaDto) {
    return this.mejaService.store(payload);
  }

  @Patch('/:id')
  @CheckPolicies((a: AppAbility) => a.can(Actions.Update, Meja))
  update(@Param('id') id: string, @Body() payload: UpdateMejaDto) {
    return this.mejaService.update(id, payload);
  }

  @Delete('/:id')
  @CheckPolicies((a: AppAbility) => a.can(Actions.Delete, Meja))
  remove(@Param('id') id: string) {
    return this.mejaService.remove(id);
  }
}
