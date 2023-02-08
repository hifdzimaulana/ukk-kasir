import {
  Injectable,
  NotFoundException,
  RequestTimeoutException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hashSync } from 'bcrypt';
import { FileStorageService } from 'src/utils/file-storage.service';
import { EntityNotFoundError, Repository } from 'typeorm';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import { User } from './user.entity';

import { v4 as uuidV4 } from 'uuid';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private readonly fileStorageService: FileStorageService,
  ) {}

  async findAll() {
    return await this.userRepo.find();
  }

  async findById(id: string) {
    try {
      return await this.userRepo.findOneByOrFail({ id });
    } catch (error) {
      console.log(error);
      if (error instanceof EntityNotFoundError) throw new NotFoundException();
    }
  }

  async store(payload: CreateUserDto, avatar: Express.Multer.File) {
    const user = this.userRepo.create(payload);
    user.password = hashSync(user.password, 10);

    if (avatar) {
      const uploadedFile = await this.fileStorageService.uploadFile(
        avatar,
        'avatar/' + uuidV4() + '.' + avatar.originalname.split('.').at(-1), // defines file extension
      );

      user.avatar_key = uploadedFile.Key;
      user.avatar_src = uploadedFile.Location;
    }

    try {
      return await this.userRepo.save(user);
    } catch (error) {
      return error;
    }
  }

  async update(
    id: string,
    payload: UpdateUserDto,
    avatar: Express.Multer.File,
  ) {
    try {
      const user = await this.userRepo.findOneByOrFail({ id });
      payload.password && (payload.password = hashSync(payload.password, 10));

      if (avatar) {
        await this.fileStorageService.uploadFile(avatar, user.avatar_key);
        if (Object.keys(payload).length == 0) {
          return { message: 'Successfully updated user avatar' };
        }
      }

      await this.userRepo.update(id, payload);
      return { message: 'Successfully updated user' };
    } catch (error) {
      if (error.code == 'TimeoutError') throw new RequestTimeoutException();
      throw new NotFoundException();
    }
  }

  async remove(id: string) {
    try {
      const user = await this.userRepo.findOneByOrFail({ id });

      if (user.avatar_key) {
        const response = await this.fileStorageService.deleteFile(
          user.avatar_key,
        );
        console.log(response);
      }

      return await this.userRepo.delete(id);
    } catch (error) {
      return error;
    }
  }
}
