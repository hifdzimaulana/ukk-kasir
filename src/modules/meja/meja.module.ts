import { Module } from '@nestjs/common';
import { MejaService } from './meja.service';
import { MejaController } from './meja.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Meja } from './meja.entity';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PoliciesGuard } from '../auth/policies.guard';
import { CaslModule } from '../casl/casl.module';

@Module({
  imports: [TypeOrmModule.forFeature([Meja]), CaslModule],
  controllers: [MejaController],
  providers: [
    MejaService,
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
export class MejaModule {}
