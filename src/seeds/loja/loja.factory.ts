import { fakerPT_BR as faker } from '@faker-js/faker';
import { CreateLojaDto } from 'src/core/loja/dto/create-loja.dto';
import { Loja } from 'src/core/loja/entities/loja.entity';
import { define } from 'typeorm-seeding';

define(Loja, () => {
  const loja = new CreateLojaDto();

  loja.descricao = faker.company.name();

  return new Loja(loja);
});
