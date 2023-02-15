import { Module } from '@nestjs/common';
import { DetailTransaksiService } from './detail-transaksi.service';
import { DetailTransaksiController } from './detail-transaksi.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DetailTransaksi } from './detail-transaksi.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DetailTransaksi])],
  controllers: [DetailTransaksiController],
  providers: [DetailTransaksiService],
})
export class DetailTransaksiModule {}
