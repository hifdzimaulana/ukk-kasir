import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { AuthRequestType } from '../auth/auth-request.type';
import { DetailTransaksi } from '../detail-transaksi/detail-transaksi.entity';
import { Meja } from '../meja/meja.entity';
import { Menu } from '../menu/menu.entity';
import { USER_ROLES } from '../user/user.entity';
import { CreateTransaksiDto, GetAllTransaksiQuery } from './transaksi.dto';
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

  async updateStatus(id: string, status: STATUS_TRANSAKSI) {
    return (
      await this.transaksiRepo.update(id, {
        status,
        user: { id: this.request.user.id },
      })
    ).affected
      ? { message: 'Successfully updated status transaksi' }
      : new NotFoundException();
  }
}
