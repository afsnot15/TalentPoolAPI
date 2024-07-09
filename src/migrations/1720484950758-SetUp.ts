import { MigrationInterface, QueryRunner } from 'typeorm';

export class SetUp1720484950758 implements MigrationInterface {
  name = 'SetUp1720484950758';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "loja" ("id" SERIAL NOT NULL, "descricao" character varying(60) NOT NULL, CONSTRAINT "pk_loja" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "produtoloja" ("id" SERIAL NOT NULL, "id_produto" integer NOT NULL, "id_loja" integer NOT NULL, "precovenda" numeric(13,2) NOT NULL, CONSTRAINT "un_produtoloja_id_produto_id_loja" UNIQUE ("id_produto", "id_loja"), CONSTRAINT "pk_produto_loja" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "produto" ("id" SERIAL NOT NULL, "descricao" character varying(60) NOT NULL, "imagem" bytea, "custo" numeric(13,3) NOT NULL DEFAULT '0', CONSTRAINT "pk_produto" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "produtoloja" ADD CONSTRAINT "fk_produtoloja_produto" FOREIGN KEY ("id_produto") REFERENCES "produto"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "produtoloja" ADD CONSTRAINT "fk_produtoloja_loja" FOREIGN KEY ("id_loja") REFERENCES "loja"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "produtoloja" DROP CONSTRAINT "fk_produtoloja_loja"`,
    );
    await queryRunner.query(
      `ALTER TABLE "produtoloja" DROP CONSTRAINT "fk_produtoloja_produto"`,
    );
    await queryRunner.query(`DROP TABLE "produto"`);
    await queryRunner.query(`DROP TABLE "produtoloja"`);
    await queryRunner.query(`DROP TABLE "loja"`);
  }
}
