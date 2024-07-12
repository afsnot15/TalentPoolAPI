import { Test, TestingModule } from '@nestjs/testing';
import { EMensagem } from '../../shared/enums/mensagem.enum';
import { LojaController } from './loja.controller';
import { LojaService } from './loja.service';

describe('LojaController', () => {
  let controller: LojaController;
  let service: LojaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LojaController],
      providers: [
        {
          provide: LojaService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<LojaController>(LojaController);
    service = module.get<LojaService>(LojaService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('Deve criar uma nova loja', async () => {
      const createLojaDto = {
        descricao: 'Loja 1',
      };

      const mockLoja = Object.assign(createLojaDto, { id: 1 });

      const spyServiceCreate = jest
        .spyOn(service, 'create')
        .mockReturnValue(Promise.resolve(mockLoja));

      const response = await controller.create(createLojaDto);

      expect(spyServiceCreate).toHaveBeenCalledWith(createLojaDto);
      expect(response.data).toEqual(mockLoja);
      expect(response.message).toBe(EMensagem.SalvoComSucesso);
    });
  });

  describe('findAll', () => {
    it('Deve obter uma listagem de loja', async () => {
      const mockListaLoja = [
        {
          id: 1,
          descricao: 'Loja 01',
        },
      ];

      const mockResponse = {
        data: mockListaLoja,
      };

      const spyServicefindAll = jest
        .spyOn(service, 'findAll')
        .mockReturnValue(Promise.resolve(mockResponse) as any);

      const response = await controller.findAll();

      expect(spyServicefindAll).toHaveBeenCalledWith();
      expect(response.data).toEqual(mockListaLoja);
      expect(response.message).toBe(undefined);
    });
  });

  describe('update', () => {
    it('Deve atualizar uma loja', async () => {
      const mockLoja = {
        id: 1,
        descricao: 'Loja 02',
      };

      const spyServiceUpdate = jest
        .spyOn(service, 'update')
        .mockReturnValue(Promise.resolve(mockLoja));

      const response = await controller.update(1, mockLoja);

      expect(spyServiceUpdate).toHaveBeenCalled();
      expect(response.data).toBe(mockLoja);
    });
  });
});
