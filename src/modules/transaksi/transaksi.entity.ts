import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { DetailTransaksi } from '../detail-transaksi/detail-transaksi.entity';
import { Meja } from '../meja/meja.entity';
import { User } from '../user/user.entity';

export enum STATUS_TRANSAKSI {
  BELUM_BAYAR = 'belum_bayar',
  LUNAS = 'lunas',
}

@Entity()
export class Transaksi {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (User) => User.transaksi)
  user: User;

  @ManyToOne(() => Meja, (Meja) => Meja.transaksi)
  meja: Meja;

  @Column('varchar', { length: 100 })
  nama_pelanggan: string;

  @Column('enum', {
    enum: STATUS_TRANSAKSI,
    default: STATUS_TRANSAKSI.BELUM_BAYAR,
  })
  status: STATUS_TRANSAKSI;

  @CreateDateColumn()
  tanggal: Date;

  @Column('int')
  total: number;

  @OneToMany(
    () => DetailTransaksi,
    (DetailTransaksi) => DetailTransaksi.transaksi,
  )
  detailTransaksi: DetailTransaksi[];
}
