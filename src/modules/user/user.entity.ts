import { Exclude } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Transaksi } from '../transaksi/transaksi.entity';

export enum USER_ROLES {
  ADMIN = 'admin',
  MANAJER = 'manajer',
  KASIR = 'kasir',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { length: 100 })
  nama: string;

  @Column('enum', { enum: USER_ROLES })
  role: USER_ROLES;

  @Column('varchar', { length: 20, unique: true })
  username: string;

  @Exclude()
  @Column('varchar', { length: 256 })
  password: string;

  @Column('varchar', { length: 256, nullable: true })
  avatarKey?: string;

  @Column('varchar', { length: 256, nullable: true })
  avatarSrc?: string;

  @OneToMany(() => Transaksi, (Transaksi) => Transaksi.user)
  transaksi: Transaksi[];
}
