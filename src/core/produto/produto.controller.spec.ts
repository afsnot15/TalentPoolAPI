import { Test, TestingModule } from '@nestjs/testing';
import { IFindAllOrder } from 'src/shared/interfaces/find-all-order.interface';
import { EMensagem } from '../../shared/enums/mensagem.enum';
import { ProdutoService } from '../produto/produto.service';
import { ProdutoController } from './produto.controller';

describe('ProdutoController', () => {
  let controller: ProdutoController;
  let service: ProdutoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProdutoController],
      providers: [
        {
          provide: ProdutoService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            findProdutoLoja: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            findImagem: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ProdutoController>(ProdutoController);
    service = module.get<ProdutoService>(ProdutoService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('Deve criar um novo produto', async () => {
      const createProdutoDto = {
        descricao: 'Produto 1',
        custo: 10.37,
        imagem: 'base64',
        produtoLoja: [],
      };

      const mockProduto = Object.assign(createProdutoDto, { id: 1 });

      const spyServiceCreate = jest
        .spyOn(service, 'create')
        .mockReturnValue(Promise.resolve(mockProduto));

      const response = await controller.create(createProdutoDto);

      expect(spyServiceCreate).toHaveBeenCalledWith(createProdutoDto);
      expect(response.data).toEqual(mockProduto);
      expect(response.message).toBe(EMensagem.SalvoComSucesso);
    });
  });

  describe('findAll', () => {
    it('Deve obter uma listagem de produto', async () => {
      const mockListaProduto = [
        {
          id: 1,
          descricao: 'Produto 1',
          custo: 10.37,
          imagem: 'base64',
          produtoLoja: [],
        },
      ];

      const mockResponse = {
        data: mockListaProduto,
        count: mockListaProduto.length,
      };

      const spyServicefindAll = jest
        .spyOn(service, 'findAll')
        .mockReturnValue(Promise.resolve(mockResponse) as any);

      const order: IFindAllOrder = { column: 'id', sort: 'asc' };

      const response = await controller.findAll(1, 10, order);

      expect(spyServicefindAll).toHaveBeenCalledWith(1, 10, order, undefined);
      expect(response.data).toEqual(mockListaProduto);
      expect(response.message).toBe(undefined);
    });
  });

  describe('findOne', () => {
    it('Deve obter um produto', async () => {
      const mockProduto = {
        id: 1,
        descricao: 'Produto 1',
        custo: 10.37,
        imagem: 'base64',
        produtoLoja: [],
      };

      const spyServiceFindOne = jest
        .spyOn(service, 'findOne')
        .mockReturnValue(Promise.resolve(mockProduto) as any);

      const response = await controller.findOne(1);

      expect(spyServiceFindOne).toHaveBeenCalledWith(1);
      expect(response.data).toEqual(mockProduto);
      expect(response.message).toBe(undefined);
    });
  });

  describe('findImagem', () => {
    it('Deve obter a imagem do produto', async () => {
      const mockImage = 'base64';

      const spyServiceFindImage = jest
        .spyOn(service, 'findImagem')
        .mockReturnValue(Promise.resolve('base64') as any);

      const response = await controller.findImagem(1);

      expect(spyServiceFindImage).toHaveBeenCalledWith(1);
      expect(response.data).toEqual(mockImage);
    });
  });

  describe('findProdutoLoja', () => {
    it('Deve obter uma lista de produtoLoja', async () => {
      const mockProdutoLoja = [
        {
          id: 1,
          idProduto: 1,
          idLoja: 1,
        },
      ];

      const spyServiceFindOne = jest
        .spyOn(service, 'findProdutoLoja')
        .mockReturnValue(Promise.resolve(mockProdutoLoja) as any);

      const response = await controller.findProdutoLoja(1);

      expect(spyServiceFindOne).toHaveBeenCalledWith(1);
      expect(response.data).toEqual(mockProdutoLoja);
      expect(response.message).toBe(undefined);
    });
  });

  describe('delete', () => {
    it('Deve remover um produto', async () => {
      const spyServiceUnactivate = jest
        .spyOn(service, 'remove')
        .mockReturnValue(Promise.resolve(false));

      const response = await controller.remove(1);

      expect(spyServiceUnactivate).toHaveBeenCalled();
      expect(response.data).toEqual(false);
      expect(response.message).toBe(EMensagem.ExcluidoSucesso);
    });
  });

  describe('update', () => {
    it('Deve atualizar um produto', async () => {
      const mockProduto = {
        id: 1,
        descricao: 'Produto 1',
        custo: 10.37,
        imagem: 'base64',
        produtoLoja: [],
      };

      const spyServiceUpdate = jest
        .spyOn(service, 'update')
        .mockReturnValue(Promise.resolve(mockProduto));

      const response = await controller.update(1, mockProduto);

      expect(spyServiceUpdate).toHaveBeenCalled();
      expect(response.data).toBe(mockProduto);
    });
  });
});
