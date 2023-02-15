import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { FileStorageModule } from 'src/modules/file-storage/file-storage.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), FileStorageModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [TypeOrmModule, UserService],
})
export class UserModule {}
