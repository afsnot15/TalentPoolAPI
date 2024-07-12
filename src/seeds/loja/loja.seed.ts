import { Loja } from 'src/core/loja/entities/loja.entity';
import { Factory, Seeder } from 'typeorm-seeding';

export class ProdutoSeed implements Seeder {
  async run(factory: Factory): Promise<void> {
    await factory(Loja)().createMany(10);
  }
}
