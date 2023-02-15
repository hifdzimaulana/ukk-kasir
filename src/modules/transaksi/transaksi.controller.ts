import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateTransaksiDto } from './transaksi.dto';
import { TransaksiService } from './transaksi.service';

@Controller('transaksi')
export class TransaksiController {
  constructor(private readonly transaksiService: TransaksiService) {}

  @Get()
  findAll() {
    return this.transaksiService.findAll();
  }

  @Post()
  store(@Body() body: CreateTransaksiDto) {
    return this.transaksiService.store(body);
  }
}
