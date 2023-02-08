import {
  Injectable,
  NotFoundException,
  RequestTimeoutException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FileStorageService } from 'src/utils/file-storage.service';
import { EntityNotFoundError, Repository } from 'typeorm';
import { CreateMenuDto, UpdateMenuDto } from './menu.dto';
import { Menu } from './menu.entity';

import { v4 as uuidV4 } from 'uuid';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Menu) private menuRepo: Repository<Menu>,
    private readonly fileStorageService: FileStorageService,
  ) {}

  async findAll() {
    return await this.menuRepo.find();
  }

  async findById(id: string) {
    try {
      return await this.menuRepo.findOneByOrFail({ id });
    } catch (error) {
      console.log(error);
      if (error instanceof EntityNotFoundError) throw new NotFoundException();
    }
  }

  async store(payload: CreateMenuDto, image: Express.Multer.File) {
    const menu = this.menuRepo.create(payload);

    if (image) {
      const uploadedFile = await this.fileStorageService.uploadFile(
        image,
        'menu/' + uuidV4() + '.' + image.originalname.split('.').at(-1), // defines file extension
      );

      menu.image_key = uploadedFile.Key;
      menu.image_src = uploadedFile.Location;
    }

    try {
      return await this.menuRepo.save(menu);
    } catch (error) {
      return error;
    }
  }

  async update(id: string, payload: UpdateMenuDto, image: Express.Multer.File) {
    try {
      const menu = await this.menuRepo.findOneByOrFail({ id });

      if (image) {
        await this.fileStorageService.uploadFile(image, menu.image_key);
        if (Object.keys(payload).length == 0) {
          return { message: 'Successfully updated menu image' };
        }
      }
      await this.menuRepo.update(id, payload);
      return { message: 'Successfully updated menu' };
    } catch (error) {
      if (error.code == 'TimeoutError') throw new RequestTimeoutException();
      throw new NotFoundException();
    }
  }

  async remove(id: string) {
    try {
      const menu = await this.menuRepo.findOneByOrFail({ id });

      if (menu.image_key) {
        const response = await this.fileStorageService.deleteFile(
          menu.image_key,
        );
        console.log(response);
      }

      return await this.menuRepo.delete(id);
    } catch (error) {
      throw new NotFoundException();
    }
  }
}
