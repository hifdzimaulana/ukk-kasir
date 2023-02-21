import { Body, Controller, Get, Post } from '@nestjs/common';
import { CheckPolicies } from '../auth/policy.decorator';
import { Actions, AppAbility } from '../casl/casl-ability.factory';
import { CreateTransaksiDto } from './transaksi.dto';
import { Transaksi } from './transaksi.entity';
import { TransaksiService } from './transaksi.service';

@Controller('transaksi')
export class TransaksiController {
  constructor(private readonly transaksiService: TransaksiService) {}

  @Get()
  @CheckPolicies((ability: AppAbility) => ability.can(Actions.Read, Transaksi))
  findAll() {
    return this.transaksiService.findAll();
  }

  @Post()
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Actions.Create, Transaksi),
  )
  store(@Body() body: CreateTransaksiDto) {
    return this.transaksiService.store(body);
  }
}
