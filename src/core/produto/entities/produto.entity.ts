import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CreateProdutoDto } from '../dto/create-produto.dto';
import { UpdateProdutoDto } from '../dto/update-produto.dto';
import { ProdutoLoja } from './produto-loja.entity';

@Entity('produto')
export class Produto {
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'pk_produto' })
  id: number;

  @Column({ length: 60, nullable: false })
  descricao: string;

  @Column({ type: 'bytea', nullable: true })
  imagem: string;

  @Column({
    type: 'numeric',
    precision: 13,
    scale: 3,
  })
  custo: number;

  @OneToMany(() => ProdutoLoja, (produtoLoja) => produtoLoja.produto, {
    eager: true,
    onDelete: 'CASCADE',
    cascade: ['insert', 'update', 'remove'],
    orphanedRowAction: 'delete',
  })
  produtoLoja: ProdutoLoja[];

  constructor(createProdutoDto: CreateProdutoDto | UpdateProdutoDto) {
    Object.assign(this, createProdutoDto);
  }
}
