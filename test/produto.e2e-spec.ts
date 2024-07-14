import { faker } from '@faker-js/faker';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import request from 'supertest';
import { Repository } from 'typeorm';
import { AppModule } from '../src/app.module';
import { Produto } from '../src/core/produto/entities/produto.entity';
import { EMensagem } from '../src/shared/enums/mensagem.enum';
import { ResponseExceptionsFilter } from '../src/shared/filters/response-exception.filter';
import { ResponseTransformInterceptor } from '../src/shared/interceptors/response-transform.interceptor';

describe('Usuario (e2e)', () => {
  let app: INestApplication;
  let repository: Repository<Produto>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
      }),
    );
    app.useGlobalInterceptors(new ResponseTransformInterceptor());
    app.useGlobalFilters(new ResponseExceptionsFilter());

    await app.startAllMicroservices();
    await app.init();

    repository = app.get<Repository<Produto>>(getRepositoryToken(Produto));
  });

  afterAll(async () => {
    //   await repository.delete({});
    await app.close();
  });

  describe('CRUD /Produto', () => {
    let id: number;

    const descricao = faker.company.name();
    const custo = faker.commerce.price({ min: 1, max: 99, dec: 2 });
    const produto = {
      descricao: descricao,
      custo: Number(custo),
      produtoLoja: [
        {
          idLoja: 1,
          precoVenda: 10.37,
        },
      ],
    };

    it('Criar um novo produto', async () => {
      const response = await request(app.getHttpServer())
        .post('/produto')
        .send(produto);

      expect(response).toBeDefined();
      expect(response.body.message).toBe(EMensagem.SalvoComSucesso);
      expect(response.body.data).toHaveProperty('id');

      id = response.body.data.id;
    });

    it('carregar o produto criado', async () => {
      const resp = await request(app.getHttpServer()).get(`/produto/${id}`);

      expect(resp).toBeDefined();
      expect(resp.body.message).toBe(null);
      expect(resp.body.data.descricao).toBe(produto.descricao);
      expect(Math.round(parseFloat(resp.body.data.custo))).toBe(
        Number(produto.custo),
      );
      expect(resp.body.data).toHaveProperty('produtoLoja');
    });

    it('alterar um produto criado', async () => {
      const produtoAlterado = Object.assign(produto, { id: id, custo: 10 });

      const resp = await request(app.getHttpServer())
        .patch(`/produto/${id}`)
        .send(produtoAlterado);

      expect(resp).toBeDefined();
      expect(resp.body.message).toBe(EMensagem.AtualizadoSucesso);
      expect(resp.body.data.custo).toBe(10);
    });

    it('lançar uma exceção ao alterar um produto criado informando id diferente', async () => {
      const usuarioAlterado = Object.assign(produto, { id: id, custo: 10 });

      const resp = await request(app.getHttpServer())
        .patch(`/produto/-1`)
        .send(usuarioAlterado);

      expect(resp).toBeDefined();
      expect(resp.status).toBe(HttpStatus.NOT_ACCEPTABLE);
      expect(resp.body.message).toBe(EMensagem.IDsDivergente);
      expect(resp.body.data).toBe(null);
    });

    it('deve excluir um produto cadastrado', async () => {
      const resp = await request(app.getHttpServer()).delete(`/produto/${id}`);

      expect(resp).toBeDefined();
      expect(resp.body.message).toBe(EMensagem.ExcluidoSucesso);
      expect(resp.body.data).toBe(true);
    });
  });

  describe('findAll /produto', () => {
    it('obter todos os produtos da página 1', async () => {
      for (let i = 0; i < 10; i++) {
        const descricao = faker.company.name();
        const custo = faker.commerce.price({ min: 1, max: 99, dec: 2 });

        const produtoFaker = {
          descricao: descricao,
          custo: Number(custo),
          produtoLoja: [],
        };

        await request(app.getHttpServer()).post('/produto').send(produtoFaker);
      }

      const order: string = JSON.stringify({ column: 'id', sort: 'asc' });

      const resp = await request(app.getHttpServer()).get(
        `/produto/1/10/${order}`,
      );

      expect(resp).toBeDefined();
      expect(resp.body.message).toBe(null);
      expect(resp.body.data.length).toBe(10);
    });
  });
});
