import {
  Body,
  Controller,
  Delete,
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
import { CreateProdutoDto } from './dto/create-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';
import { Produto } from './entities/produto.entity';
import { ProdutoService } from './produto.service';

@Controller('produto')
export class ProdutoController {
  constructor(private readonly produtoService: ProdutoService) {}

  @Post()
  async create(
    @Body() createProdutoDto: CreateProdutoDto,
  ): Promise<IResponse<Produto>> {
    const data = await this.produtoService.create(createProdutoDto);

    return new HttpResponse<Produto>(data).onCreated();
  }

  @Get(':page/:size/:order')
  async findAll(
    @Param('page') pPage: number,
    @Param('size') pSize: number,
    @Param('order', ParseFindAllOrderPipe) pOrder: IFindAllOrder,
    @Query('filter', ParseFindAllFilterPipe)
    pFilter?: IFindAllFilter | IFindAllFilter[],
  ): Promise<IResponse<Produto[]>> {
    const { data, count } = await this.produtoService.findAll(
      pPage,
      pSize,
      pOrder,
      pFilter,
    );

    return new HttpResponse<Produto[]>(data, undefined, count);
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<IResponse<Produto>> {
    const data = await this.produtoService.findOne(id);

    return new HttpResponse<Produto>(data);
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateProdutoDto: UpdateProdutoDto,
  ): Promise<IResponse<Produto>> {
    const data = await this.produtoService.update(id, updateProdutoDto);

    return new HttpResponse<Produto>(data).onUpdated();
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<IResponse<boolean>> {
    const data = await this.produtoService.remove(id);

    return new HttpResponse<boolean>(data).onDeleted();
  }
}
