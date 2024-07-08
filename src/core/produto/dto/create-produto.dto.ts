import { IsArray, IsBase64, IsNotEmpty, IsOptional } from 'class-validator';
import { EMensagem } from '../../../shared/enums/mensagem.enum';
import { CreateProdutoLojaDto } from './create-produto-loja.dto';

export class CreateProdutoDto {
  @IsNotEmpty({ message: `Nome ${EMensagem.NaoPodeSerVazio}` })
  descricao: string;

  @IsOptional()
  custo: number;

  @IsBase64()
  @IsOptional()
  imagem: string;

  @IsArray({ message: `Produto Loja ${EMensagem.TipoInvalido}` })
  produtoLoja: CreateProdutoLojaDto[];
}
