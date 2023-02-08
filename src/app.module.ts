import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MenuModule } from './modules/menu/menu.module';
import { MejaModule } from './modules/meja/meja.module';
import { TransaksiModule } from './modules/transaksi/transaksi.module';
import { Menu } from './modules/menu/menu.entity';
import { Meja } from './modules/meja/meja.entity';
import { UserModule } from './modules/user/user.module';
import { User } from './modules/user/user.entity';
import { Transaksi } from './modules/transaksi/transaksi.entity';
import { DetailTransaksiModule } from './modules/detail-transaksi/detail-transaksi.module';
import { DetailTransaksi } from './modules/detail-transaksi/detail-transaksi.entity';
import { FileStorageService } from './utils/file-storage.service';
import { ConfigModule } from '@nestjs/config';
import { UtilsModule } from './utils/utils.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [Menu, Meja, User, Transaksi, DetailTransaksi],
      synchronize: true,
    }),
    MenuModule,
    MejaModule,
    TransaksiModule,
    UserModule,
    DetailTransaksiModule,
    UtilsModule,
  ],
  controllers: [AppController],
  providers: [AppService, FileStorageService],
})
export class AppModule {}
