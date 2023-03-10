import { HttpException, Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { AuthRequestType } from '../auth/auth-request.type';
import { DetailTransaksi } from '../detail-transaksi/detail-transaksi.entity';
import { Meja, STATUS_MEJA } from '../meja/meja.entity';
import { Menu } from '../menu/menu.entity';
import { USER_ROLES } from '../user/user.entity';
import {
  CreateTransaksiDto,
  GetAllTransaksiQuery,
  UpdateStatusTransaksiDto,
} from './transaksi.dto';
import { STATUS_TRANSAKSI, Transaksi } from './transaksi.entity';

@Injectable()
export class TransaksiService {
  constructor(
    @InjectRepository(Transaksi)
    private transaksiRepo: Repository<Transaksi>,
    private dataSource: DataSource,
    @Inject(REQUEST) private request: AuthRequestType,
  ) {}

  async findAll(queries: GetAllTransaksiQuery) {
    const query = this.transaksiRepo
      .createQueryBuilder('transaksi')
      .leftJoinAndSelect('transaksi.detailTransaksi', 'detailTransaksi')
      .leftJoinAndSelect('detailTransaksi.menu', 'menu');

    if (queries.after)
      query.andWhere('transaksi.tanggal >= :after', { after: queries.after });
    if (queries.before)
      query.andWhere('transaksi.tanggal < :before', { before: queries.before });
    if (queries.status)
      query.andWhere('transaksi.status = :status', { status: queries.status });

    if (this.request.user.role == USER_ROLES.KASIR) {
      query.andWhere('transaksi.user.id = :userId', {
        userId: this.request.user.id,
      });
      return await query.getMany();
    }

    if (queries.userId)
      query.andWhere('transaksi.user.id = :userId', { userId: queries.userId });

    return await query.getMany();
  }

  async findById(id: string) {
    const query = this.transaksiRepo
      .createQueryBuilder('transaksi')
      .leftJoinAndSelect('transaksi.detailTransaksi', 'detailTransaksi')
      .leftJoinAndSelect('detailTransaksi.menu', 'menu')
      .where('transaksi.id = :id', { id });

    if (this.request.user.role == USER_ROLES.KASIR) {
      query.andWhere('transaksi.user.id = :userId', {
        userId: this.request.user.id,
      });
    }

    return await query.getOneOrFail();
  }

  async store(body: CreateTransaksiDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { ability, ...user } = this.request.user;

      const meja = await queryRunner.manager.findOneByOrFail(Meja, {
        nomor_meja: body.nomor_meja,
      });

      if (meja.status == STATUS_MEJA.TERISI)
        throw new HttpException(
          `Meja ${meja.nomor_meja} sedang tidak tersedia`,
          303,
        );

      await queryRunner.manager.update(Meja, meja.id, {
        status: STATUS_MEJA.TERISI,
      });

      let grandTotal = 0;
      const transaksi = await queryRunner.manager.save(Transaksi, {
        meja,
        nama_pelanggan: body.nama_pelanggan,
        user,
        total: grandTotal,
        status: body.status,
      });

      const menuIds = body.payload.map((val) => val.id_menu);
      const menus = await queryRunner.manager.findBy(Menu, { id: In(menuIds) });

      body.payload.map(async (val, i) => {
        delete val.id_menu;
        grandTotal += menus[i].harga * val.qty;
        return await queryRunner.manager.save(DetailTransaksi, {
          menu: menus[i],
          transaksi,
          qty: val.qty,
          subtotal: menus[i].harga * val.qty,
          notes: val.notes,
        });
      });

      await queryRunner.manager.update(Transaksi, transaksi.id, {
        total: grandTotal,
      });

      await queryRunner.commitTransaction();
      return { message: 'Sukses membuat transaksi' };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.log(error);
    } finally {
      await queryRunner.release();
    }
  }

  async updateStatus(id: string, body: UpdateStatusTransaksiDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const transaksi = await queryRunner.manager.findOneOrFail(Transaksi, {
        where: { id },
        relations: ['meja'],
      });

      if (body.status_meja) {
        await queryRunner.manager.update(Meja, transaksi.meja.id, {
          status: body.status_meja,
        });
      } else if (body.status_transaksi == STATUS_TRANSAKSI.LUNAS) {
        await queryRunner.manager.update(Meja, transaksi.meja.id, {
          status: STATUS_MEJA.KOSONG,
        });
      }

      transaksi.status = body.status_transaksi;
      await queryRunner.manager.save(transaksi);

      await queryRunner.commitTransaction();

      return { message: 'Successfully updated status transaksi' };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.log(error);
      throw new HttpException(error, 500);
    } finally {
      await queryRunner.release();
    }
  }
}
