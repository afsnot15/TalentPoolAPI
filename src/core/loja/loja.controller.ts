import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { HttpResponse } from '../../shared/classes/http-response';
import { IFindAllFilter } from '../../shared/interfaces/find-all-filter.interface';
import { IFindAllOrder } from '../../shared/interfaces/find-all-order.interface';
import { IResponse } from '../../shared/interfaces/response.interface';
import { ParseFindAllFilterPipe } from '../../shared/pipes/parse-find-all-filter.pipe';
import { ParseFindAllOrderPipe } from '../../shared/pipes/parse-find-all-order.pipe';
import { CreateLojaDto } from './dto/create-loja.dto';
import { UpdateLojaDto } from './dto/update-loja.dto';
import { Loja } from './entities/loja.entity';
import { LojaService } from './loja.service';

@Controller('loja')
export class LojaController {
  constructor(private readonly lojaService: LojaService) {}

  @Post()
  async create(@Body() createLojaDto: CreateLojaDto): Promise<IResponse<Loja>> {
    const data = await this.lojaService.create(createLojaDto);

    return new HttpResponse<Loja>(data).onCreated();
  }
  @Get(':page/:size/:order')
  async findAll(
    @Param('page') pPage: number,
    @Param('size') pSize: number,
    @Param('order', ParseFindAllOrderPipe) pOrder: IFindAllOrder,
    @Query('filter', ParseFindAllFilterPipe)
    pFilter?: IFindAllFilter | IFindAllFilter[],
  ): Promise<IResponse<Loja[]>> {
    const { data, count } = await this.lojaService.findAll(
      pPage,
      pSize,
      pOrder,
      pFilter,
    );

    return new HttpResponse<Loja[]>(data, undefined, count);
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateLojaDto: UpdateLojaDto,
  ): Promise<IResponse<Loja>> {
    const data = await this.lojaService.update(id, updateLojaDto);

    return new HttpResponse<Loja>(data).onUpdated();
  }
}
