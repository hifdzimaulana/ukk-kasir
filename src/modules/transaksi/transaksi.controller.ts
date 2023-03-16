import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CheckPolicies } from '../auth/policy.decorator';
import { Actions, AppAbility } from '../casl/casl-ability.factory';
import {
  CreateTransaksiDto,
  GetAllTransaksiQuery,
  UpdateStatusTransaksiDto,
} from './transaksi.dto';
import { Transaksi } from './transaksi.entity';
import { TransaksiService } from './transaksi.service';

@Controller('transaksi')
export class TransaksiController {
  constructor(private readonly transaksiService: TransaksiService) {}

  @Get()
  @CheckPolicies((ability: AppAbility) => ability.can(Actions.Read, Transaksi))
  findAll(@Query() queries: GetAllTransaksiQuery) {
    return this.transaksiService.findAll(queries);
  }

  @Get(':id')
  @CheckPolicies((a: AppAbility) => a.can(Actions.Read, Transaksi))
  findById(@Param('id') id: string, @Query() queries) {
    return this.transaksiService.findById(id, queries);
  }

  @Post()
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Actions.Create, Transaksi),
  )
  store(@Body() body: CreateTransaksiDto) {
    return this.transaksiService.store(body);
  }

  @Patch('edit-status/:id')
  @CheckPolicies((a: AppAbility) => a.can(Actions.Update, Transaksi))
  updateStatus(
    @Body() body: UpdateStatusTransaksiDto,
    @Param('id') id: string,
  ) {
    return this.transaksiService.updateStatus(id, body);
  }
}
