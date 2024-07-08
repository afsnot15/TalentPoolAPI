import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './config/database/database.module';
import { ProdutoModule } from './core/produto/produto.module';
import { LojaModule } from './core/loja/loja.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env${process.env.NODE_ENV ? '.' + process.env.NODE_ENV : ''}`,
      isGlobal: true,
    }),
    DatabaseModule,
    ProdutoModule,
    LojaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
