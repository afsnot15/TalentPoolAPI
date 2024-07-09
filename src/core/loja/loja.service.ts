import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EMensagem } from '../../shared/enums/mensagem.enum';
import { handleFilter } from '../../shared/helpers/sql.helper';
import { IFindAllFilter } from '../../shared/interfaces/find-all-filter.interface';
import { IFindAllOrder } from '../../shared/interfaces/find-all-order.interface';
import { IResponse } from '../../shared/interfaces/response.interface';
import { CreateLojaDto } from './dto/create-loja.dto';
import { UpdateLojaDto } from './dto/update-loja.dto';
import { Loja } from './entities/loja.entity';

@Injectable()
export class LojaService {
  @InjectRepository(Loja)
  private repository: Repository<Loja>;

  async create(pCreateLojaDto: CreateLojaDto): Promise<Loja> {
    const created = this.repository.create(new Loja(pCreateLojaDto));

    return await this.repository.save(created);
  }

  async findAll(
    pPage: number,
    pSize: number,
    pOrder: IFindAllOrder,
    pFilter?: IFindAllFilter | IFindAllFilter[],
  ): Promise<IResponse<Loja[]>> {
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

  async update(pId: number, pUpdateLojaDto: UpdateLojaDto): Promise<Loja> {
    this.validateId(pId, pUpdateLojaDto.id);

    await this.validateFindedLoja(pId);

    return await this.repository.save(pUpdateLojaDto);
  }

  private validateId(pIdParameter: number, pIdBody): void {
    if (pIdParameter !== pIdBody) {
      throw new HttpException(
        EMensagem.IDsDivergente,
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
  }

  private async validateFindedLoja(pId: number): Promise<void> {
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
}
