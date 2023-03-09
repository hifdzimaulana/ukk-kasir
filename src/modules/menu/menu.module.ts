import { Module } from '@nestjs/common';
import { MenuService } from './menu.service';
import { MenuController } from './menu.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Menu } from './menu.entity';
import { FileStorageModule } from 'src/modules/file-storage/file-storage.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CaslModule } from '../casl/casl.module';
import { PoliciesGuard } from '../auth/policies.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Menu]), FileStorageModule, CaslModule],
  controllers: [MenuController],
  providers: [
    MenuService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PoliciesGuard,
    },
  ],
  exports: [TypeOrmModule],
})
export class MenuModule {}
