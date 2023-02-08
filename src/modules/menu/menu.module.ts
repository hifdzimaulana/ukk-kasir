import { Module } from '@nestjs/common';
import { MenuService } from './menu.service';
import { MenuController } from './menu.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Menu } from './menu.entity';
import { UtilsModule } from 'src/utils/utils.module';

@Module({
  imports: [TypeOrmModule.forFeature([Menu]), UtilsModule],
  controllers: [MenuController],
  providers: [MenuService],
  exports: [TypeOrmModule],
})
export class MenuModule {}
