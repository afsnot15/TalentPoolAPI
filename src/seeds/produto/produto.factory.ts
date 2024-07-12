import { fakerPT_BR as faker } from '@faker-js/faker';
import { CreateProdutoDto } from 'src/core/produto/dto/create-produto.dto';
import { Produto } from 'src/core/produto/entities/produto.entity';
import { define } from 'typeorm-seeding';

define(Produto, () => {
  const produto = new CreateProdutoDto();

  const custo = faker.commerce.price({ min: 1, max: 99, dec: 2 });

  produto.descricao = faker.commerce.productName();
  produto.custo = Number(custo);

  return new Produto(produto);
});
