import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { CreateLojaDto } from '../dto/create-loja.dto';
import { UpdateLojaDto } from '../dto/update-loja.dto';

@Entity({ name: 'loja' })
export class Loja {
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'pk_loja' })
  id: number;

  @Column({ length: 60, nullable: false })
  descricao: string;

  constructor(createLojaDto: CreateLojaDto | UpdateLojaDto) {
    Object.assign(this, createLojaDto);
  }
}
