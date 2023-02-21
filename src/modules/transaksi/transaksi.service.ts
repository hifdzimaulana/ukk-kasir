import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { DetailTransaksi } from '../detail-transaksi/detail-transaksi.entity';
import { Meja } from '../meja/meja.entity';
import { Menu } from '../menu/menu.entity';
import { User } from '../user/user.entity';
import { CreateTransaksiDto } from './transaksi.dto';
import { Transaksi } from './transaksi.entity';

@Injectable()
export class TransaksiService {
  constructor(
    @InjectRepository(Transaksi)
    private transaksiRepo: Repository<Transaksi>,
    private dataSource: DataSource,
  ) {}

  async findAll() {
    return await this.transaksiRepo.find({ relations: ['detailTransaksi'] });
  }

  async store(body: CreateTransaksiDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = await queryRunner.manager.findOneByOrFail(User, {
        id: 'b515effb-dd2f-44af-a8bc-5e0d51209688',
      });

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
      const menus = await queryRunner.manager.findBy(Menu, { id: In(menuIds) }); // 4

      let detailTransaksi = body.payload.map(async (val, i) => {
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

      return detailTransaksi;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.log(error);
    } finally {
      await queryRunner.release();
    }
  }
}
