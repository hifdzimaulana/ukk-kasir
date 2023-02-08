import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  AfterLoad,
  AfterInsert,
  AfterUpdate,
} from 'typeorm';
import { DetailTransaksi } from '../detail-transaksi/detail-transaksi.entity';

@Entity()
export class Menu {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { length: 100 })
  nama: string;

  @Column('enum', { enum: ['makanan', 'minuman'] })
  jenis: JENIS_MENU;

  @Column('text', { nullable: true })
  deskripsi?: string;

  @Column('varchar', { length: 256, nullable: true })
  imageKey?: string;

  @Column('varchar', { length: 256, nullable: true })
  imageSrc?: string;

  @Column('int')
  harga: number;

  @OneToMany(() => DetailTransaksi, (DetailTransaksi) => DetailTransaksi.menu)
  detailTransaksi: DetailTransaksi[];
}

export enum JENIS_MENU {
  MAKANAN = 'makanan',
  MINUMAN = 'minuman',
}
