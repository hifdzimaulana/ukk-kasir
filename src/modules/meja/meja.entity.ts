import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Transaksi } from '../transaksi/transaksi.entity';

@Entity()
export class Meja {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { length: 3, unique: true })
  nomor_meja: string;

  @OneToMany(() => Transaksi, (Transaksi) => Transaksi.meja)
  transaksi: Transaksi[];
}
