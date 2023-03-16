import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundError, Repository } from 'typeorm';
import { CreateMejaDto, MejaQuery, UpdateMejaDto } from './meja.dto';
import { Meja } from './meja.entity';

@Injectable()
export class MejaService {
  constructor(@InjectRepository(Meja) private mejaRepo: Repository<Meja>) {}

  async findAll(queries: MejaQuery) {
    const query = this.mejaRepo.createQueryBuilder('meja');

    if (queries.status)
      query.where('meja.status = :status', { status: queries.status });

    return await query.getMany();
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

  async remove(id: string) {
    return (await this.mejaRepo.delete(id)).affected
      ? { message: 'Successfully deleted meja' }
      : new NotFoundException();
  }
}
