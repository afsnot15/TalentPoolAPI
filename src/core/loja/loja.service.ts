import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EMensagem } from '../../shared/enums/mensagem.enum';
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

  async findAll(): Promise<IResponse<Loja[]>> {
    const data = await this.repository.find({
      loadEagerRelations: false,
    });

    return { data, message: null };
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
