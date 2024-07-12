import { ILike } from 'typeorm';
import { handleFilter } from './sql.helper';

describe('handleFilter', () => {
  it('deve retornar um objeto vazio quando o filtro estiver indefinido', () => {
    expect(handleFilter(undefined)).toEqual({});
  });

  it('deve lidar com um único filtro convertendo string em booleano corretamente', () => {
    const filter = { column: 'ativo', value: 'true' };
    expect(handleFilter(filter)).toEqual({ ativo: true });
  });

  it('deve lidar com um único filtro convertendo string para ILike corretamente', () => {
    const filter = { column: 'nome', value: 'teste' };
    expect(handleFilter(filter)).toEqual({ nome: ILike('%teste%') });
  });

  it('deve lidar com um único filtro convertendo string em número corretamente', () => {
    const filter = { column: 'idade', value: '30' };
    expect(handleFilter(filter)).toEqual({ idade: 30 });
  });

  it('deve lidar com vários filtros corretamente', () => {
    const filters = [
      { column: 'ativo', value: 'true' },
      { column: 'nome', value: 'teste' },
      { column: 'idade', value: '25' },
    ];
    expect(handleFilter(filters)).toEqual({
      ativo: true,
      nome: ILike('%teste%'),
      idade: 25,
    });
  });

  it('deve retornar um objeto vazio quando o valor do filtro for indefinido', () => {
    const filter = { column: 'ativo', value: undefined };
    expect(handleFilter(filter)).toEqual({});
  });

  it('deve ignorar filtros com valor indefinido em uma lista de filtros', () => {
    const filters = [
      { column: 'ativo', value: undefined },
      { column: 'nome', value: 'teste' },
    ];
    expect(handleFilter(filters)).toEqual({ nome: ILike('%teste%') });
  });
});
