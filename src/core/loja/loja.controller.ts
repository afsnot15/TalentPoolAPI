import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { HttpResponse } from '../../shared/classes/http-response';
import { IResponse } from '../../shared/interfaces/response.interface';
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
  @Get()
  async findAll(): Promise<IResponse<Loja[]>> {
    const { data } = await this.lojaService.findAll();

    return new HttpResponse<Loja[]>(data, undefined);
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
