import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Loja } from '../../loja/entities/loja.entity';
import { Produto } from './produto.entity';

@Entity('produtoloja')
@Unique('un_produtoloja_id_produto_id_loja', ['idProduto', 'idLoja'])
export class ProdutoLoja {
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'pk_produto_loja' })
  id: number;

  @Column({ name: 'id_produto', nullable: false })
  idProduto: number;

  @Column({ name: 'id_loja', nullable: false })
  idLoja: number;

  @Column({
    name: 'precovenda',
    type: 'numeric',
    precision: 13,
    scale: 3,
    nullable: false,
  })
  precoVenda: number;

  @ManyToOne(() => Produto, (produto) => produto.id)
  @JoinColumn({
    name: 'id_produto',
    foreignKeyConstraintName: 'fk_produtoloja_produto',
  })
  produto: Produto;

  @ManyToOne(() => Loja, (loja) => loja.id)
  @JoinColumn({
    name: 'id_loja',
    foreignKeyConstraintName: 'fk_produtoloja_loja',
  })
  loja: Loja;
}
