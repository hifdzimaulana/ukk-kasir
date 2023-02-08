import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundError, Repository } from 'typeorm';
import { CreateMejaDto, UpdateMejaDto } from './meja.dto';
import { Meja, STATUS_MEJA } from './meja.entity';

@Injectable()
export class MejaService {
  constructor(@InjectRepository(Meja) private mejaRepo: Repository<Meja>) {}

  async findAll(status?: STATUS_MEJA) {
    if (status) {
      return await this.mejaRepo.findBy({ status });
    }
    return await this.mejaRepo.find();
  }

  async findById(id: string) {
    try {
      return await this.mejaRepo.findOneByOrFail({ id });
    } catch (error) {
      console.log(error);
      if (error instanceof EntityNotFoundError) throw new NotFoundException();
    }
  }

  async store(payload: CreateMejaDto) {
    try {
      const meja = this.mejaRepo.create(payload);
      return await this.mejaRepo.save(meja);
    } catch (error) {
      return error;
    }
  }

  async update(id: string, payload: UpdateMejaDto) {
    return (await this.mejaRepo.update(id, payload)).affected
      ? { message: 'Successfully updated meja' }
      : new NotFoundException();
  }

  async toggleStatus(id: string) {
    try {
      const meja = await this.mejaRepo.findOneByOrFail({ id });

      meja.status =
        meja.status == STATUS_MEJA.KOSONG
          ? STATUS_MEJA.TERPAKAI
          : STATUS_MEJA.KOSONG;

      return {
        message: 'Switched status meja',
        data: await this.mejaRepo.save(meja),
      };
    } catch (error) {
      return error;
    }
  }

  async remove(id: string) {
    return (await this.mejaRepo.delete(id)).affected
      ? { message: 'Successfully deleted meja' }
      : new NotFoundException();
  }
}
