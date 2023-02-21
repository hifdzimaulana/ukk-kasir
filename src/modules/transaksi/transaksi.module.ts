import { Module } from '@nestjs/common';
import { TransaksiService } from './transaksi.service';
import { TransaksiController } from './transaksi.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaksi } from './transaksi.entity';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CaslModule } from '../casl/casl.module';
import { PoliciesGuard } from '../auth/policies.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Transaksi]), CaslModule],
  controllers: [TransaksiController],
  providers: [
    TransaksiService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PoliciesGuard,
    },
  ],
})
export class TransaksiModule {}
