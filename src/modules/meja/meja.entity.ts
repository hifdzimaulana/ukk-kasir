import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Transaksi } from '../transaksi/transaksi.entity';

export enum STATUS_MEJA {
  KOSONG = 'kosong',
  TERISI = 'terisi',
}
@Entity()
export class Meja {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { length: 3, unique: true })
  nomor_meja: string;

  @Column('enum', { enum: STATUS_MEJA, default: STATUS_MEJA.KOSONG })
  status: STATUS_MEJA;

  @OneToMany(() => Transaksi, (Transaksi) => Transaksi.meja)
  transaksi: Transaksi[];
}
