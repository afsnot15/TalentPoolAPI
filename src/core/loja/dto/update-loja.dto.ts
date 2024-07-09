import { PartialType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { EMensagem } from '../../../shared/enums/mensagem.enum';
import { CreateLojaDto } from './create-loja.dto';

export class UpdateLojaDto extends PartialType(CreateLojaDto) {
  @IsNotEmpty({ message: `ID ${EMensagem.DeveSerInformado}` })
  id: number;
}
