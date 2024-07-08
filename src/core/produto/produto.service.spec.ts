import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { IFindAllOrder } from 'src/shared/interfaces/find-all-order.interface';
import { Repository } from 'typeorm';
import { EMensagem } from '../../shared/enums/mensagem.enum';
import { ProdutoLoja } from './entities/produto-loja.entity';
import { Produto } from './entities/produto.entity';
import { ProdutoService } from './produto.service';

describe('ProdutoService', () => {
  let service: ProdutoService;
  let repository: Repository<Produto>;
  let produtoLojaRepository: Repository<ProdutoLoja>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProdutoService,
        {
          provide: getRepositoryToken(Produto),
          useValue: {
            create: jest.fn(),
            findOne: jest.fn(),
            findAndCount: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(ProdutoLoja),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ProdutoService>(ProdutoService);
    repository = module.get<Repository<Produto>>(getRepositoryToken(Produto));
    produtoLojaRepository = module.get<Repository<ProdutoLoja>>(
      getRepositoryToken(ProdutoLoja),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('Deve criar um novo produto', async () => {
      const createProdutoDto = {
        descricao: 'Produto 1',
        custo: 10.37,
        imagem: 'base64',
        produtoLoja: [],
      };

      const produtoMock = Object.assign(createProdutoDto, { id: 1 });

      const spyRepositorySave = jest
        .spyOn(repository, 'save')
        .mockResolvedValue(Promise.resolve(produtoMock));

      const response = await service.create(createProdutoDto);

      expect(response).toEqual(produtoMock);
      expect(spyRepositorySave).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('Deve obter uma listagem de produto', async () => {
      const createProdutoDtoMock = {
        id: 1,
        descricao: 'Produto 1',
        custo: 10.37,
        imagem: 'base64',
        produtoLoja: [
          {
            idProduto: 1,
            idLoja: 1,
            precoVenda: 20.5,
          },
        ],
      };

      const produtoListMock = [Object.assign(createProdutoDtoMock)];

      const expected = { data: produtoListMock, count: 1, message: null };

      const order: IFindAllOrder = { column: 'id', sort: 'asc' };

      const spyRepositoryFind = jest
        .spyOn(repository, 'findAndCount')
        .mockReturnValue(Promise.resolve([produtoListMock, 1]));

      const response = await service.findAll(1, 10, order);

      expect(spyRepositoryFind).toHaveBeenCalled();
      expect(response).toEqual(expected);
    });

    describe('findOne', () => {
      it('Deve obter um produto através do id', async () => {
        const produtoExpected = {
          id: 1,
          descricao: 'Produto 1',
          custo: 10.37,
          imagem: 'base64',
          produtoLoja: [],
        };

        const spyRepositoryFindOne = jest
          .spyOn(repository, 'findOne')
          .mockReturnValue(Promise.resolve(produtoExpected));

        const finded = await service.findOne(1);

        expect(finded).toEqual(produtoExpected);
        expect(spyRepositoryFindOne).toHaveBeenCalled();
      });
    });

    describe('update', () => {
      it('Deve alterar um produto', async () => {
        const produtoMock = {
          id: 1,
          imagem: 'base64',
          descricao: 'Produto 1',
          custo: 10.37,
          produtoLoja: [{ id: 1, idProduto: 1, idLoja: 1, precoVenda: 20.5 }],
        };

        const updateProdutoMock = Object.assign(produtoMock);

        const spyRepositoryFindOne = jest
          .spyOn(repository, 'findOne')
          .mockReturnValue(Promise.resolve(updateProdutoMock));

        const spyRepositorySave = jest
          .spyOn(repository, 'save')
          .mockReturnValue(Promise.resolve(updateProdutoMock));

        const response = await service.update(1, produtoMock);

        expect(response).toEqual(produtoMock);
        expect(spyRepositoryFindOne).toHaveBeenCalled();
        expect(spyRepositorySave).toHaveBeenCalled();
      });

      it('Deve lançar uma exceção quando os ids forem diferentes ao alterar um usuário', async () => {
        const produtoMock = {
          id: 1,
          imagem: 'base64',
          descricao: 'Produto 1',
          custo: 10.37,
          produtoLoja: [],
        };

        await expect(service.update(999, produtoMock)).rejects.toThrow(
          EMensagem.IDsDivergente,
        );
      });

      it('Deve caso não encontre um produto com o id fornecido', async () => {
        const produtoMock = {
          id: 1,
          imagem: 'base64',
          descricao: 'Produto 1',
          custo: 10.37,
          produtoLoja: [],
        };

        const spyRepositoryFindOne = jest
          .spyOn(repository, 'findOne')
          .mockReturnValue(Promise.resolve(null));

        await expect(service.update(1, produtoMock)).rejects.toThrow(
          EMensagem.RegistroNaoEcontrado,
        );

        expect(spyRepositoryFindOne).toHaveBeenCalled();
      });
    });

    describe('remove', () => {
      it('Deve excluir um produto', async () => {
        const produtoMock = {
          id: 1,
          imagem: 'base64',
          descricao: 'Produto 1',
          custo: 10.37,
          produtoLoja: [],
        };

        const spyRepositoryFindOne = jest
          .spyOn(repository, 'findOne')
          .mockReturnValue(Promise.resolve(produtoMock));

        const spyRepositoryDelete = jest
          .spyOn(repository, 'delete')
          .mockReturnValue(Promise.resolve(produtoMock) as any);

        const response = await service.remove(1);

        expect(response).toEqual(true);
        expect(spyRepositoryFindOne).toHaveBeenCalled();
        expect(spyRepositoryDelete).toHaveBeenCalled();
      });

      it('Deve Lançar uma exceção ao tentar excluir um produto inexistente', async () => {
        const spyRepositoryFindOne = jest
          .spyOn(repository, 'findOne')
          .mockReturnValue(Promise.resolve(null));

        await expect(service.remove(1)).rejects.toThrow(
          EMensagem.RegistroNaoEcontrado,
        );

        expect(spyRepositoryFindOne).toHaveBeenCalled();
      });
    });
  });
});
