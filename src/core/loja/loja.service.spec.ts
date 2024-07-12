import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EMensagem } from '../../shared/enums/mensagem.enum';
import { Loja } from './entities/loja.entity';
import { LojaService } from './loja.service';

describe('LojaService', () => {
  let service: LojaService;
  let repository: Repository<Loja>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LojaService,
        {
          provide: getRepositoryToken(Loja),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<LojaService>(LojaService);
    repository = module.get<Repository<Loja>>(getRepositoryToken(Loja));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('Deve criar uma nava loja', async () => {
      const createLojaDto = {
        descricao: 'Loja 01',
      };

      const lojaCreatedMock = Object.assign(createLojaDto, { id: 1 });

      const spyRepositorySave = jest
        .spyOn(repository, 'save')
        .mockResolvedValue(Promise.resolve(lojaCreatedMock));

      const response = await service.create(createLojaDto);

      expect(response).toEqual(lojaCreatedMock);
      expect(spyRepositorySave).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('Deve obter uma listagem de loja', async () => {
      const loja = {
        id: 1,
        descricao: 'Loja 01',
      };

      const lojaListMock = [Object.assign(loja)];

      const expected = { data: lojaListMock, message: null };

      const spyRepositoryFind = jest
        .spyOn(repository, 'find')
        .mockReturnValue(Promise.resolve(lojaListMock));

      const response = await service.findAll();

      expect(spyRepositoryFind).toHaveBeenCalled();
      expect(response).toEqual(expected);
    });
  });

  describe('update', () => {
    it('Deve alterar uma loja', async () => {
      const updateLojaDto = {
        id: 1,
        descricao: 'Loja 01',
      };

      const updateLojaMock = Object.assign(updateLojaDto);

      const spyRepositoryFindOne = jest
        .spyOn(repository, 'findOne')
        .mockReturnValue(Promise.resolve(updateLojaMock));

      const spyRepositorySave = jest
        .spyOn(repository, 'save')
        .mockReturnValue(Promise.resolve(updateLojaMock));

      const response = await service.update(1, updateLojaMock);

      expect(response).toEqual(updateLojaDto);
      expect(spyRepositoryFindOne).toHaveBeenCalled();
      expect(spyRepositorySave).toHaveBeenCalled();
    });

    it('Deve lançar uma exceção quando os ids forem diferentes ao alterar uma loja', async () => {
      const updateLojaDto = {
        id: 1,
        descricao: 'Loja 01',
      };

      await expect(service.update(999, updateLojaDto)).rejects.toThrow(
        EMensagem.IDsDivergente,
      );
    });

    it('Deve caso não encontre uma loja com o id fornecido', async () => {
      const updateLojaDto = {
        id: 1,
        descricao: 'Loja 01',
      };

      const spyRepositoryFindOne = jest
        .spyOn(repository, 'findOne')
        .mockReturnValue(Promise.resolve(null));

      await expect(service.update(1, updateLojaDto)).rejects.toThrow(
        EMensagem.RegistroNaoEcontrado,
      );

      expect(spyRepositoryFindOne).toHaveBeenCalled();
    });
  });
});
