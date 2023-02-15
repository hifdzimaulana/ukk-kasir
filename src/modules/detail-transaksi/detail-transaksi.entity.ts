import { Column, PrimaryGeneratedColumn, ManyToOne, Entity } from 'typeorm';
import { Menu } from '../menu/menu.entity';
import { Transaksi } from '../transaksi/transaksi.entity';

@Entity()
export class DetailTransaksi {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Transaksi, (Transaksi) => Transaksi.detailTransaksi)
  transaksi: Transaksi;

  @ManyToOne(() => Menu, (Menu) => Menu.detailTransaksi)
  menu: Menu;

  @Column('int')
  qty: number;

  @Column('int')
  subtotal: number;

  @Column('text', { nullable: true })
  notes?: string;
}
