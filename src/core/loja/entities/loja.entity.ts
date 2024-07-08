import { Column, PrimaryGeneratedColumn } from 'typeorm';

export class Loja {
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'pk_loja' })
  id: number;

  @Column({ length: 60, nullable: false })
  descricao: string;
}
