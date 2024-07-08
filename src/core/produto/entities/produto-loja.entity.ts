import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Produto } from './produto.entity';

@Entity('produtoloja')
export class ProdutoLoja {
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'pk_produto_loja' })
  id: number;

  @Column({ name: 'id_produto', nullable: false })
  idProduto: number;

  @Column({ name: 'id_loja', nullable: false })
  /*@OneToOne(() => Produto, (produto) => produto.id)
  @JoinColumn({
    name: 'id_loja',
    foreignKeyConstraintName: 'fk_produtoloja_loja',
  })*/
  idLoja: number;

  @Column({ type: 'numeric', precision: 13, scale: 2, nullable: false })
  precoVenda: number;

  @ManyToOne(() => Produto, (produto) => produto.id)
  @JoinColumn({
    name: 'id_produto',
    foreignKeyConstraintName: 'fk_produtoloja_produto',
  })
  produto: Produto;
}
