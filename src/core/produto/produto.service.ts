import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IFindAllFilter } from 'src/shared/interfaces/find-all-filter.interface';
import { IFindAllOrder } from 'src/shared/interfaces/find-all-order.interface';
import { Repository } from 'typeorm';
import { EMensagem } from '../../shared/enums/mensagem.enum';
import { handleFilter } from '../../shared/helpers/sql.helper';
import { IResponse } from '../../shared/interfaces/response.interface';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';
import { ProdutoLoja } from './entities/produto-loja.entity';
import { Produto } from './entities/produto.entity';

@Injectable()
export class ProdutoService {
  @InjectRepository(Produto)
  private repository: Repository<Produto>;

  @InjectRepository(ProdutoLoja)
  private produtoLojaRepository: Repository<ProdutoLoja>;

  async create(pCreateProdutoDto: CreateProdutoDto): Promise<Produto> {
    this.validateProdutoLojaDuplicate(pCreateProdutoDto);

    const created = this.repository.create(new Produto(pCreateProdutoDto));

    return await this.repository.save(created);
  }

  async findAll(
    pPage: number,
    pSize: number,
    pOrder: IFindAllOrder,
    pFilter?: IFindAllFilter | IFindAllFilter[],
  ): Promise<IResponse<Produto[]>> {
    const where = handleFilter(pFilter);

    const [data, count] = await this.repository.findAndCount({
      loadEagerRelations: false,
      order: { [pOrder.column]: pOrder.sort },
      where,
      skip: pSize * pPage,
      take: pSize,
    });

    return { data, count, message: null };
  }

  async findOne(pId: number): Promise<Produto> {
    return await this.repository.findOne({
      where: { id: pId },

      relations: {
        produtoLoja: {
          loja: true,
        },
      },
    });
  }

  async findProdutoLoja(pId: number): Promise<ProdutoLoja[]> {
    return await this.produtoLojaRepository.find({
      where: { idProduto: pId },

      relations: {
        loja: true,
      },
    });
  }

  async findImagem(pId: number): Promise<string> {
    const produto = await this.repository.findOne({
      loadEagerRelations: false,
      select: ['imagem'],
      where: { id: pId },
    });

    if (!produto) {
      return null;
    }

    return produto.imagem;
  }

  async update(
    pId: number,
    pUpdateProdutoDto: UpdateProdutoDto,
  ): Promise<Produto> {
    this.validateId(pId, pUpdateProdutoDto.id);

    await this.validateFindedProduto(pId);

    this.validateProdutoLojaDuplicate(pUpdateProdutoDto);

    await this.saveProdutoLoja(pUpdateProdutoDto);

    return await this.repository.save(pUpdateProdutoDto);
  }

  async remove(pId: number): Promise<boolean> {
    await this.validateFindedProduto(pId);

    await this.repository.delete(pId);

    return true;
  }

  private validateId(pIdParameter: number, pIdBody): void {
    if (pIdParameter !== pIdBody) {
      throw new HttpException(
        EMensagem.IDsDivergente,
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
  }

  private async validateFindedProduto(pId: number): Promise<void> {
    const finded = await this.repository.findOne({
      select: ['id'],
      where: { id: pId },
    });

    if (!finded) {
      throw new HttpException(
        EMensagem.RegistroNaoEcontrado,
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
  }

  private async saveProdutoLoja(
    pUpdateProdutoDto: UpdateProdutoDto,
  ): Promise<void> {
    await this.produtoLojaRepository.delete({
      idProduto: pUpdateProdutoDto.id,
    });
  }

  private validateProdutoLojaDuplicate(
    pCreateProdutoDto: CreateProdutoDto | UpdateProdutoDto,
  ): void {
    pCreateProdutoDto.produtoLoja.forEach((produtoLoja) => {
      const count = pCreateProdutoDto.produtoLoja.filter(
        (p) =>
          p.idLoja === produtoLoja.idLoja &&
          p.idProduto === produtoLoja.idProduto,
      ).length;

      if (count > 1) {
        throw new HttpException(
          EMensagem.RegistroDuplicado,
          HttpStatus.NOT_ACCEPTABLE,
        );
      }
    });
  }
}
